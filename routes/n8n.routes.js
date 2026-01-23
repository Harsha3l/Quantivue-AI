import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// n8n configuration from environment variables
const N8N_BASE_URL = process.env.N8N_BASE_URL || "http://localhost:5678";
const N8N_EMAIL = process.env.N8N_EMAIL || "harshatrilakshmi@gmail.com";
const N8N_PASSWORD = process.env.N8N_PASSWORD || "Harsha@2004";

/**
 * Authenticate with n8n using email and password
 * Returns session cookie/token for subsequent API calls
 * 
 * Note: n8n may use different authentication formats depending on version.
 * This function tries multiple common formats.
 */
async function authenticateN8n() {
  console.log(`🔐 Attempting n8n authentication with email: ${N8N_EMAIL}`);
  
  // Try method 1: Using username field with email value (most common n8n format)
  try {
    const response = await fetch(`${N8N_BASE_URL}/rest/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: N8N_EMAIL,  // n8n REST API typically uses 'username' field even for email
        password: N8N_PASSWORD,
      }),
    });

    if (response.ok) {
      const cookies = response.headers.get("set-cookie");
      if (cookies) {
        console.log("✅ n8n authentication successful (username method)");
        return cookies;
      }
      // Try response body for token
      const responseData = await response.json().catch(() => null);
      if (responseData?.token) {
        console.log("✅ n8n authentication successful (token method)");
        return `n8n-auth=${responseData.token}`;
      }
    } else {
      const errorText = await response.text();
      console.log(`⚠️ Username method failed (${response.status}): ${errorText}`);
    }
  } catch (err) {
    console.log(`⚠️ Username method error:`, err.message);
  }

  // Try method 2: Using email field (some n8n versions)
  try {
    const response = await fetch(`${N8N_BASE_URL}/rest/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: N8N_EMAIL,
        password: N8N_PASSWORD,
      }),
    });

    if (response.ok) {
      const cookies = response.headers.get("set-cookie");
      if (cookies) {
        console.log("✅ n8n authentication successful (email method)");
        return cookies;
      }
    } else {
      const errorText = await response.text();
      console.log(`⚠️ Email method failed (${response.status}): ${errorText}`);
    }
  } catch (err) {
    console.log(`⚠️ Email method error:`, err.message);
  }

  // All methods failed - provide helpful instructions
  const errorMsg = 
    `❌ n8n authentication failed (401: Wrong username or password)\n\n` +
    `📋 SOLUTION: You need to create the user account in n8n first:\n\n` +
    `1. Open n8n in your browser: ${N8N_BASE_URL}\n` +
    `2. Create an account with:\n` +
    `   - Email: ${N8N_EMAIL}\n` +
    `   - Password: ${N8N_PASSWORD}\n` +
    `3. After creating the account, restart your backend server\n\n` +
    `💡 Note: If you already have an n8n account but used a different email/username,\n` +
    `   update N8N_EMAIL and N8N_PASSWORD in your .env file or environment variables.`;
  
  console.error(errorMsg);
  throw new Error(errorMsg);
}

/**
 * Import a workflow template to n8n
 */
router.post("/import/:templateId", async (req, res) => {
  try {
    const templateId = String(req.params.templateId || "").trim();
    if (!templateId) {
      return res.status(400).json({ detail: "Missing template id" });
    }

    // Read template file
    const templatesDir = path.resolve(__dirname, "..", "templates");
    const filePath = path.join(templatesDir, `${templateId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ detail: "Template not found" });
    }

    const templateContent = fs.readFileSync(filePath, "utf-8");
    const workflow = JSON.parse(templateContent);

    // Authenticate with n8n
    let sessionCookie;
    try {
      sessionCookie = await authenticateN8n();
    } catch (authError) {
      return res.status(401).json({
        detail: "Failed to authenticate with n8n",
        error: authError.message,
      });
    }

    // Import workflow to n8n
    // Note: sessionCookie might be a full cookie string or just the value
    const cookieHeader = typeof sessionCookie === 'string' && sessionCookie.includes('=') 
      ? sessionCookie.split(';')[0]  // Extract first cookie if multiple
      : `n8n-auth=${sessionCookie}`;

    const importResponse = await fetch(`${N8N_BASE_URL}/rest/workflows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        name: workflow.name || templateId,
        nodes: workflow.nodes || [],
        connections: workflow.connections || {},
        settings: workflow.settings || {},
        staticData: workflow.staticData || null,
        tags: workflow.tags || [],
      }),
    });

    if (!importResponse.ok) {
      const errorText = await importResponse.text();
      return res.status(importResponse.status).json({
        detail: "Failed to import workflow to n8n",
        error: errorText,
      });
    }

    const importedWorkflow = await importResponse.json();

    return res.status(200).json({
      message: "Workflow imported successfully to n8n",
      workflow: {
        id: importedWorkflow.id,
        name: importedWorkflow.name,
        n8nUrl: `${N8N_BASE_URL}/workflow/${importedWorkflow.id}`,
      },
    });
  } catch (error) {
    console.error("❌ n8n import error:", error);
    return res.status(500).json({
      detail: "Failed to import workflow to n8n",
      error: error.message,
    });
  }
});

/**
 * Test n8n connection
 */
router.get("/test", async (req, res) => {
  try {
    const sessionCookie = await authenticateN8n();
    return res.status(200).json({
      message: "Successfully connected to n8n",
      n8nUrl: N8N_BASE_URL,
      email: N8N_EMAIL,
    });
  } catch (error) {
    return res.status(500).json({
      detail: "Failed to connect to n8n",
      error: error.message,
    });
  }
});

export default router;
