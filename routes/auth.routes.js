import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../index.js";
import nodemailer from "nodemailer";

const router = express.Router();

function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getSmtpTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt for email:", email);

    // Validation
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({
        detail: "Email and password are required",
      });
    }

    // Find user with case-insensitive email
    const result = await query(
      "SELECT id, email, password, full_name FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (result.rows.length === 0) {
      console.log("❌ User not found with email:", email);
      return res.status(401).json({
        detail: "Invalid email or password",
      });
    }

    const user = result.rows[0];
    console.log("✅ User found:", user.email);
    console.log("🔍 Stored password hash length:", user.password?.length);

    // Compare password with bcrypt
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
      console.log("🔑 Password match result:", isMatch);
    } catch (bcryptError) {
      console.error("❌ Bcrypt comparison error:", bcryptError.message);
      return res.status(500).json({
        detail: "Password verification failed",
      });
    }

    if (!isMatch) {
      console.log("❌ Password does not match for user:", email);
      return res.status(401).json({
        detail: "Invalid email or password",
      });
    }

    // Record login (for admin metrics)
    try {
      await query(
        `INSERT INTO login_logs (user_id, ip_address, user_agent)
         VALUES ($1, $2, $3)`,
        [user.id, req.ip || null, req.headers["user-agent"] || null]
      );
      await query(`UPDATE users SET login_count = COALESCE(login_count, 0) + 1 WHERE id = $1`, [user.id]);
    } catch (logError) {
      console.warn("⚠️ Failed to record login log:", logError.message);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful for user:", user.email);
    console.log("🎫 Token generated successfully");

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      detail: error.message || "Login failed. Please try again.",
    });
  }
}

/* =========================
   SIGNUP
========================= */
router.post("/signup", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    console.log("📝 Signup attempt - Email:", email, "Password length:", password?.length);

    if (!full_name || !email || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        detail: "Full name, email, and password are required",
      });
    }

    if (password.length < 6) {
      console.log("❌ Password too short:", password.length);
      return res.status(400).json({
        detail: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const exists = await query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (exists.rows.length > 0) {
      console.log("❌ User already exists with email:", email);
      return res.status(409).json({
        detail: "User with this email already exists",
      });
    }

    // Hash password with bcrypt (salt rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed successfully");

    const result = await query(
      `INSERT INTO users (full_name, email, password, signup_type, email_verified, sms_verified, verified)
       VALUES ($1, $2, $3, 'normal', false, false, false)
       RETURNING id, email, full_name, created_at`,
      [full_name, email.toLowerCase(), hashedPassword]
    );

    console.log("✅ User created successfully - ID:", result.rows[0].id);

    res.status(201).json({
      message: "Signup successful! Please verify your email.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({
      detail: error.message || "Signup failed. Please try again.",
    });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", loginHandler);
// Some frontend flows hit /auth/signin — keep it as an alias to /auth/login
router.post("/signin", loginHandler);

/* =========================
   FORGOT PASSWORD
   Sends a verification code to user's email
========================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ detail: "Email is required" });
    }

    // Do not leak whether an email exists; but still validate format basically
    const userResult = await query("SELECT id FROM users WHERE LOWER(email) = LOWER($1)", [normalizedEmail]);

    // If user doesn't exist, still respond OK (prevents user enumeration)
    if (userResult.rows.length === 0) {
      return res.status(200).json({ message: "If the email exists, a verification code was sent." });
    }

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store latest code for email
    await query(
      `INSERT INTO password_resets (email, token, expires_at)
       VALUES ($1, $2, $3)`,
      [normalizedEmail, code, expiresAt]
    );

    const transporter = getSmtpTransport();
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@quantivue.ai";

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Quantivue AI" <${fromEmail}>`,
          to: normalizedEmail,
          subject: "Your Quantivue AI Password Reset Code",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .code-box { background: #f4f4f4; border: 2px dashed #25a0e6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #25a0e6; }
                .footer { margin-top: 30px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Password Reset Verification Code</h2>
                <p>Hello,</p>
                <p>You requested a password reset for your Quantivue AI account. Use the verification code below:</p>
                <div class="code-box">
                  <div class="code">${code}</div>
                </div>
                <p>This code will expire in <strong>10 minutes</strong>.</p>
                <p>If you didn't request this code, please ignore this email.</p>
                <div class="footer">
                  <p>Best regards,<br>Quantivue AI Team</p>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `Your Quantivue AI password reset verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
        });
        console.log(`✅ Password reset email sent to ${normalizedEmail}`);
      } catch (emailError) {
        console.error("❌ Failed to send password reset email:", emailError);
        // Still log code for dev/debugging
        console.warn(`⚠️ Email failed. Password reset code (dev only): ${code}`);
        throw emailError; // Re-throw to trigger error response
      }
    } else {
      // Dev fallback: log code to server console if SMTP not configured
      console.warn("⚠️ SMTP not configured. Password reset code (dev only):", code);
      console.warn("📧 To enable email sending, configure SMTP settings in .env:");
      console.warn("   SMTP_HOST=smtp.gmail.com");
      console.warn("   SMTP_PORT=587");
      console.warn("   SMTP_USER=your-email@gmail.com");
      console.warn("   SMTP_PASS=your-app-password");
      console.warn(`   Verification code for ${normalizedEmail}: ${code}`);
    }

    // Return success message
    const responseMessage = transporter
      ? "Verification code sent to your email"
      : "Verification code generated. Check server logs (SMTP not configured)";

    return res.status(200).json({
      message: responseMessage,
      ...(process.env.RETURN_RESET_CODE === "true" || !transporter ? { verification_code: code } : {}),
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    const errorMessage = error.message?.includes("SMTP") || error.message?.includes("email")
      ? "Failed to send email. Please check SMTP configuration."
      : "Failed to send verification code";
    return res.status(500).json({ detail: errorMessage });
  }
});

/* =========================
   RESET PASSWORD
   Verifies code and updates password
========================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, verification_code, new_password, confirm_password } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !verification_code || !new_password || !confirm_password) {
      return res.status(400).json({ detail: "All fields are required" });
    }

    if (String(new_password).length < 6) {
      return res.status(400).json({ detail: "Password must be at least 6 characters long" });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ detail: "Passwords do not match" });
    }

    const resetResult = await query(
      `SELECT id, token, expires_at
       FROM password_resets
       WHERE LOWER(email) = LOWER($1)
       ORDER BY id DESC
       LIMIT 1`,
      [normalizedEmail]
    );

    if (resetResult.rows.length === 0) {
      return res.status(400).json({ detail: "Invalid or expired verification code" });
    }

    const row = resetResult.rows[0];
    const expiresAt = new Date(row.expires_at);
    if (String(row.token) !== String(verification_code) || expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ detail: "Invalid or expired verification code" });
    }

    const hashedPassword = await bcrypt.hash(String(new_password), 10);

    await query(`UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE LOWER(email) = LOWER($2)`, [
      hashedPassword,
      normalizedEmail,
    ]);

    await query(`DELETE FROM password_resets WHERE id = $1`, [row.id]);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    return res.status(500).json({ detail: "Failed to reset password" });
  }
});

export default router;
