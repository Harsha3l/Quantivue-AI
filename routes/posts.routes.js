import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import jwt from "jsonwebtoken";
import { query, pool } from "../index.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// AUTHENTICATION MIDDLEWARE
// =============================
function getBearerToken(req) {
  const header = req.headers?.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function requireUser(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ detail: "Missing Authorization token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    if (!decoded?.userId) return res.status(401).json({ detail: "Invalid token" });

    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
}

// =============================
// FILE UPLOAD CONFIGURATION
// =============================
const uploadsDir = path.resolve(__dirname, "..", "uploads", "media");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowedMimes.join(", ")}`), false);
    }
  },
});

// =============================
// HELPER FUNCTIONS
// =============================

/**
 * Trigger n8n webhook with post data
 * @param {Object} postData - Post data to send to n8n
 * @returns {Promise<Object>} n8n response
 */
async function triggerN8nWebhook(postData) {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/post-automation";
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postData.postId,
        userId: postData.userId,
        caption: postData.caption,
        platforms: postData.platforms,
        postingMode: postData.postingMode,
        scheduledAt: postData.scheduledAt,
        mediaFiles: postData.mediaFiles,
        callbackUrl: `${backendUrl}/api/posts/${postData.postId}/webhook-status`,
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error triggering n8n webhook:", error);
    throw error;
  }
}

/**
 * Get full post details with platforms and media
 * @param {number} postId - Post ID
 * @returns {Promise<Object>} Post object with related data
 */
async function getPostDetails(postId) {
  const client = await pool.connect();
  try {
    // Get post
    const postResult = await client.query(
      `SELECT p.*, u.email, u.full_name 
       FROM posts p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.id = $1`,
      [postId]
    );

    if (postResult.rows.length === 0) {
      return null;
    }

    const post = postResult.rows[0];

    // Get platforms
    const platformsResult = await client.query(
      `SELECT * FROM post_platforms WHERE post_id = $1 ORDER BY platform`,
      [postId]
    );

    // Get media files
    const mediaResult = await client.query(
      `SELECT * FROM media_files WHERE post_id = $1 ORDER BY created_at`,
      [postId]
    );

    // Get approvals
    const approvalsResult = await client.query(
      `SELECT pa.*, u.email as approver_email, u.full_name as approver_name 
       FROM post_approvals pa 
       LEFT JOIN users u ON pa.approver_id = u.id 
       WHERE pa.post_id = $1 
       ORDER BY pa.created_at DESC`,
      [postId]
    );

    return {
      ...post,
      platforms: platformsResult.rows,
      mediaFiles: mediaResult.rows.map((m) => ({
        ...m,
        url: `/uploads/media/${m.file_name}`, // Relative URL for frontend
      })),
      approvals: approvalsResult.rows,
    };
  } finally {
    client.release();
  }
}

// =============================
// API ROUTES
// =============================

/**
 * POST /api/posts
 * Create a new post with media upload
 */
router.post("/", requireUser, upload.array("media", 10), async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const { caption, platforms, postingMode, scheduledAt } = req.body;

    // Validation
    if (!caption || !platforms || !postingMode) {
      return res.status(400).json({
        detail: "Missing required fields: caption, platforms, postingMode",
      });
    }

    // Parse platforms (should be JSON array)
    let platformsArray;
    try {
      platformsArray = typeof platforms === "string" ? JSON.parse(platforms) : platforms;
      if (!Array.isArray(platformsArray) || platformsArray.length === 0) {
        throw new Error("Platforms must be a non-empty array");
      }
    } catch (e) {
      return res.status(400).json({ detail: "Invalid platforms format. Must be a JSON array." });
    }

    // Validate posting mode
    if (!["automatic", "approval"].includes(postingMode)) {
      return res.status(400).json({ detail: "postingMode must be 'automatic' or 'approval'" });
    }

    // Validate scheduled date if provided
    let scheduledTimestamp = null;
    if (scheduledAt) {
      scheduledTimestamp = new Date(scheduledAt);
      if (isNaN(scheduledTimestamp.getTime())) {
        return res.status(400).json({ detail: "Invalid scheduledAt date format" });
      }
      if (scheduledTimestamp < new Date()) {
        return res.status(400).json({ detail: "scheduledAt must be in the future" });
      }
    }

    // Determine initial status
    const initialStatus = postingMode === "approval" ? "pending_approval" : scheduledAt ? "scheduled" : "draft";

    await client.query("BEGIN");

    // Insert post
    const postResult = await client.query(
      `INSERT INTO posts (user_id, caption, posting_mode, status, scheduled_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [userId, caption, postingMode, initialStatus, scheduledTimestamp]
    );

    const postId = postResult.rows[0].id;

    // Insert platforms
    for (const platform of platformsArray) {
      await client.query(
        `INSERT INTO post_platforms (post_id, platform) 
         VALUES ($1, $2) 
         ON CONFLICT (post_id, platform) DO NOTHING`,
        [postId, platform]
      );
    }

    // Insert media files
    const mediaFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const mediaResult = await client.query(
          `INSERT INTO media_files (post_id, file_name, file_path, file_type, file_size, mime_type)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [
            postId,
            file.filename,
            file.path,
            path.extname(file.originalname).slice(1).toLowerCase(),
            file.size,
            file.mimetype,
          ]
        );
        mediaFiles.push({
          id: mediaResult.rows[0].id,
          fileName: file.filename,
          fileType: path.extname(file.originalname).slice(1).toLowerCase(),
          mimeType: file.mimetype,
          fileSize: file.size,
        });
      }
    }

    await client.query("COMMIT");

    // Trigger n8n webhook if not draft
    if (initialStatus !== "draft") {
      try {
        await triggerN8nWebhook({
          postId,
          userId,
          caption,
          platforms: platformsArray,
          postingMode,
          scheduledAt: scheduledTimestamp,
          mediaFiles: mediaFiles.map((m) => ({
            fileName: m.fileName,
            fileType: m.fileType,
            mimeType: m.mimeType,
            url: `${process.env.BACKEND_URL || "http://localhost:8000"}/uploads/media/${m.fileName}`,
          })),
        });
      } catch (n8nError) {
        console.error("Failed to trigger n8n webhook:", n8nError);
        // Update post status to failed
        await client.query(`UPDATE posts SET status = 'failed', error_message = $1 WHERE id = $2`, [
          `n8n webhook failed: ${n8nError.message}`,
          postId,
        ]);
      }
    }

    // Get full post details
    const postDetails = await getPostDetails(postId);

    res.status(201).json({
      message: "Post created successfully",
      post: postDetails,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating post:", error);
    res.status(500).json({
      detail: "Failed to create post",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

/**
 * GET /api/posts
 * List all posts for the authenticated user
 */
router.get("/", requireUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, platform, limit = 50, offset = 0 } = req.query;

    let queryText = `
      SELECT p.*, u.email, u.full_name,
             COUNT(DISTINCT pp.id) as platform_count,
             COUNT(DISTINCT mf.id) as media_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN post_platforms pp ON p.id = pp.post_id
      LEFT JOIN media_files mf ON p.id = mf.post_id
      WHERE p.user_id = $1
    `;
    const queryParams = [userId];
    let paramIndex = 2;

    if (status) {
      queryText += ` AND p.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    queryText += ` GROUP BY p.id, u.email, u.full_name ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await query(queryText, queryParams);

    // Get platforms for each post
    const posts = await Promise.all(
      result.rows.map(async (post) => {
        const platformsResult = await query(
          `SELECT platform, platform_status FROM post_platforms WHERE post_id = $1`,
          [post.id]
        );
        return {
          ...post,
          platforms: platformsResult.rows,
        };
      })
    );

    res.json(posts);
  } catch (error) {
    console.error("Error listing posts:", error);
    res.status(500).json({
      detail: "Failed to list posts",
      error: error.message,
    });
  }
});

/**
 * GET /api/posts/:id
 * Get a single post with full details
 */
router.get("/:id", requireUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = parseInt(req.params.id);

    const postDetails = await getPostDetails(postId);

    if (!postDetails) {
      return res.status(404).json({ detail: "Post not found" });
    }

    // Verify ownership
    if (postDetails.user_id !== userId) {
      return res.status(403).json({ detail: "Access denied" });
    }

    res.json(postDetails);
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(500).json({
      detail: "Failed to get post",
      error: error.message,
    });
  }
});

/**
 * POST /api/posts/:id/approve
 * Approve a post (for approval mode)
 */
router.post("/:id/approve", requireUser, async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const postId = parseInt(req.params.id);
    const { comment } = req.body;

    // Get post
    const postResult = await client.query(`SELECT * FROM posts WHERE id = $1`, [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ detail: "Post not found" });
    }

    const post = postResult.rows[0];

    // Verify ownership
    if (post.user_id !== userId) {
      return res.status(403).json({ detail: "Access denied" });
    }

    // Check if post is pending approval
    if (post.status !== "pending_approval") {
      return res.status(400).json({
        detail: `Post cannot be approved. Current status: ${post.status}`,
      });
    }

    await client.query("BEGIN");

    // Insert approval record
    await client.query(
      `INSERT INTO post_approvals (post_id, approver_id, action, comment)
       VALUES ($1, $2, 'approved', $3)`,
      [postId, userId, comment || null]
    );

    // Update post status
    const newStatus = post.scheduled_at && new Date(post.scheduled_at) > new Date() ? "scheduled" : "posted";
    await client.query(`UPDATE posts SET status = $1 WHERE id = $2`, [newStatus, postId]);

    await client.query("COMMIT");

    // Trigger n8n webhook
    try {
      const platformsResult = await query(`SELECT platform FROM post_platforms WHERE post_id = $1`, [postId]);
      const mediaResult = await query(`SELECT * FROM media_files WHERE post_id = $1`, [postId]);

      await triggerN8nWebhook({
        postId,
        userId: post.user_id,
        caption: post.caption,
        platforms: platformsResult.rows.map((r) => r.platform),
        postingMode: post.posting_mode,
        scheduledAt: post.scheduled_at,
        mediaFiles: mediaResult.rows.map((m) => ({
          fileName: m.file_name,
          fileType: m.file_type,
          mimeType: m.mime_type,
          url: `${process.env.BACKEND_URL || "http://localhost:8000"}/uploads/media/${m.file_name}`,
        })),
      });
    } catch (n8nError) {
      console.error("Failed to trigger n8n webhook after approval:", n8nError);
    }

    const postDetails = await getPostDetails(postId);
    res.json({
      message: "Post approved successfully",
      post: postDetails,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error approving post:", error);
    res.status(500).json({
      detail: "Failed to approve post",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

/**
 * POST /api/posts/:id/reject
 * Reject a post (for approval mode)
 */
router.post("/:id/reject", requireUser, async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const postId = parseInt(req.params.id);
    const { comment } = req.body;

    // Get post
    const postResult = await client.query(`SELECT * FROM posts WHERE id = $1`, [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ detail: "Post not found" });
    }

    const post = postResult.rows[0];

    // Verify ownership
    if (post.user_id !== userId) {
      return res.status(403).json({ detail: "Access denied" });
    }

    // Check if post is pending approval
    if (post.status !== "pending_approval") {
      return res.status(400).json({
        detail: `Post cannot be rejected. Current status: ${post.status}`,
      });
    }

    await client.query("BEGIN");

    // Insert rejection record
    await client.query(
      `INSERT INTO post_approvals (post_id, approver_id, action, comment)
       VALUES ($1, $2, 'rejected', $3)`,
      [postId, userId, comment || null]
    );

    // Update post status
    await client.query(`UPDATE posts SET status = 'rejected' WHERE id = $1`, [postId]);

    await client.query("COMMIT");

    const postDetails = await getPostDetails(postId);
    res.json({
      message: "Post rejected",
      post: postDetails,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error rejecting post:", error);
    res.status(500).json({
      detail: "Failed to reject post",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

/**
 * POST /api/posts/:id/webhook-status
 * Webhook endpoint for n8n to update post status
 * This endpoint should be called by n8n after posting to social media
 */
router.post("/:id/webhook-status", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { status, platformStatuses, errorMessage, n8nExecutionId } = req.body;

    // Optional: Verify webhook secret if configured
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET;
    if (webhookSecret) {
      const providedSecret = req.headers["x-webhook-secret"];
      if (providedSecret !== webhookSecret) {
        return res.status(401).json({ detail: "Invalid webhook secret" });
      }
    }

    // Get post
    const postResult = await query(`SELECT * FROM posts WHERE id = $1`, [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ detail: "Post not found" });
    }

    // Update post status
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (status) {
      updateFields.push(`status = $${paramIndex}`);
      updateValues.push(status);
      paramIndex++;
    }

    if (errorMessage) {
      updateFields.push(`error_message = $${paramIndex}`);
      updateValues.push(errorMessage);
      paramIndex++;
    }

    if (n8nExecutionId) {
      updateFields.push(`n8n_execution_id = $${paramIndex}`);
      updateValues.push(n8nExecutionId);
      paramIndex++;
    }

    if (status === "posted") {
      updateFields.push(`posted_at = CURRENT_TIMESTAMP`);
    }

    if (updateFields.length > 0) {
      updateValues.push(postId);
      await query(`UPDATE posts SET ${updateFields.join(", ")} WHERE id = $${paramIndex}`, updateValues);
    }

    // Update platform statuses
    if (platformStatuses && Array.isArray(platformStatuses)) {
      for (const platformStatus of platformStatuses) {
        await query(
          `UPDATE post_platforms 
           SET platform_status = $1, platform_post_id = $2, platform_error = $3, updated_at = CURRENT_TIMESTAMP
           WHERE post_id = $4 AND platform = $5`,
          [
            platformStatus.status,
            platformStatus.platformPostId || null,
            platformStatus.error || null,
            postId,
            platformStatus.platform,
          ]
        );
      }
    }

    res.json({ message: "Post status updated successfully" });
  } catch (error) {
    console.error("Error updating post status from webhook:", error);
    res.status(500).json({
      detail: "Failed to update post status",
      error: error.message,
    });
  }
});

export default router;
