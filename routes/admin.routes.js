import express from "express";
import { query } from "../index.js";
import jwt from "jsonwebtoken";

const router = express.Router();

function getBearerToken(req) {
  const header = req.headers?.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function requireAdmin(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ detail: "Missing Authorization token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    if (!decoded?.admin) {
      return res.status(403).json({ detail: "Admin access required" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
}

/* =========================
   ADMIN LOGIN
   Returns: JWT token for admin dashboard
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@gmail.com").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

    if (!email || !password) {
      return res.status(400).json({ detail: "Email and password are required" });
    }

    if (String(email).trim().toLowerCase() !== adminEmail || String(password) !== adminPassword) {
      return res.status(401).json({ detail: "Invalid email or password" });
    }

    const token = jwt.sign(
      { admin: true, email: adminEmail },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Admin login successful",
      token,
      admin: { email: adminEmail },
    });
  } catch (error) {
    console.error("Error in admin login:", error);
    return res.status(500).json({ detail: "Admin login failed" });
  }
});

/* =========================
   INITIALIZE DATABASE TABLES
   Creates necessary tables if they don't exist
========================= */
router.post("/init-db", requireAdmin, async (req, res) => {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        signup_type VARCHAR(50) DEFAULT 'normal',
        email_verified BOOLEAN DEFAULT false,
        sms_verified BOOLEAN DEFAULT false,
        verified BOOLEAN DEFAULT false,
        login_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create login_logs table (fallback if FK can't be created)
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS login_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ip_address VARCHAR(45),
          user_agent TEXT
        )
      `);
    } catch (e) {
      await query(`
        CREATE TABLE IF NOT EXISTS login_logs (
          id SERIAL PRIMARY KEY,
          user_id TEXT,
          login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ip_address VARCHAR(45),
          user_agent TEXT
        )
      `);
    }

    // Create payments table (fallback if FK can't be created)
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          payment_method VARCHAR(100),
          transaction_id VARCHAR(255) UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (e) {
      await query(`
        CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          user_id TEXT,
          amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          payment_method VARCHAR(100),
          transaction_id VARCHAR(255) UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    // Create workflows table (fallback if FK can't be created)
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS workflows (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (e) {
      await query(`
        CREATE TABLE IF NOT EXISTS workflows (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          user_id TEXT,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    // Create indexes
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
      CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
    `);

    res.status(200).json({
      message: "Database tables initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({
      detail: "Failed to initialize database",
      error: error.message,
    });
  }
});

/* =========================
   GET DASHBOARD METRICS
   Returns: totalUsers, totalLogins, totalPayments
========================= */
router.get("/metrics", requireAdmin, async (req, res) => {
  try {
    // Get total users count
    const usersResult = await query("SELECT COUNT(*) as count FROM users");
    const totalUsers = parseInt(usersResult.rows[0].count) || 0;

    // Get total login count
    const loginsResult = await query(
      `SELECT COUNT(*) as total_logins FROM login_logs`
    );
    const totalLogins = parseInt(loginsResult.rows[0].total_logins) || 0;

    // Get total payments (sum of payment amounts)
    const paymentsResult = await query(
      `SELECT COALESCE(SUM(amount), 0) as total_payments 
       FROM payments 
       WHERE status = 'completed'`
    );
    const totalPayments = parseFloat(paymentsResult.rows[0].total_payments) || 0;

    res.status(200).json({
      totalUsers,
      totalLogins,
      totalPayments,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    // Return default values if error
    res.status(200).json({
      totalUsers: 0,
      totalLogins: 0,
      totalPayments: 0,
    });
  }
});

/* =========================
   GET ALL WORKFLOWS
   Returns: List of all workflows
========================= */
router.get("/workflows", requireAdmin, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, description 
       FROM workflows 
       ORDER BY id DESC`
    );

    const workflows = result.rows || [];

    res.status(200).json({
      workflows,
      total: workflows.length,
    });
  } catch (error) {
    console.error("Error fetching workflows:", error);
    res.status(500).json({
      detail: "Failed to fetch workflows",
      error: error.message,
    });
  }
});

/* =========================
   GET ALL WEBSITES
   Returns: List of all websites
========================= */
router.get("/websites", requireAdmin, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, user_id, domain, type, status, created_at
       FROM websites
       ORDER BY id DESC`
    );

    const websites = result.rows || [];
    return res.status(200).json({ websites, total: websites.length });
  } catch (error) {
    console.error("Error fetching websites:", error);
    return res.status(500).json({ detail: "Failed to fetch websites" });
  }
});

/* =========================
   GET USERS
   Returns: List of users (id, full_name, email, created_at)
========================= */
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, full_name, email, created_at
       FROM users
       ORDER BY id DESC`
    );

    const users = result.rows || [];
    return res.status(200).json({ users, total: users.length });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ detail: "Failed to fetch users" });
  }
});

export default router;
