import dotenv from "dotenv";
dotenv.config({ override: true });

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import {
  testConnection,
  closePool,
  query,
  pool,
  logDatabaseConfig,
} from "./db.config.js";

import { initializeDatabase } from "./db-init.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import templatesRoutes from "./routes/templates.routes.js";
import n8nRoutes from "./routes/n8n.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import postsRoutes from "./routes/posts.routes.js";

// =============================
// __dirname FIX
// =============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// LOGGER
// =============================
const logger = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
};

// =============================
// EXPRESS APP
// =============================
const app = express();

// =============================
// MIDDLEWARE
// =============================
// If you run a separate frontend in dev, set FRONTEND_ORIGIN=http://localhost:5173
// If you serve the frontend from this same server (recommended for "single port"), CORS is not needed.
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // same-origin / server-to-server
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json()); // 🔥 REQUIRED
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// =============================
// API ROUTES
// =============================
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ✅ AUTH ROUTES
app.use("/auth", authRoutes);

// ✅ ADMIN ROUTES
app.use("/admin", adminRoutes);

// ✅ LOCAL TEMPLATES API ROUTES (avoid conflict with frontend route /templates/*)
app.use("/api/templates", templatesRoutes);

// ✅ N8N INTEGRATION ROUTES (email-based authentication)
app.use("/api/n8n", n8nRoutes);

// ✅ CONTACT FORM ROUTES
app.use("/api/contact", contactRoutes);

// ✅ BILLING ROUTES
app.use("/api/billing", billingRoutes);

// ✅ POSTS ROUTES (Influencer Platform)
app.use("/api/posts", postsRoutes);

// =============================
// STATIC FILES (Uploads)
// =============================
const uploadsPath = path.join(__dirname, "uploads");
if (fs.existsSync(uploadsPath)) {
  app.use("/uploads", express.static(uploadsPath));
}

// =============================
// FRONTEND (VITE BUILD)
// =============================
const distPath = path.join(__dirname, "dist");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    if (
      req.path.startsWith("/auth") ||
      req.path === "/admin" ||
      req.path.startsWith("/admin/") ||
      req.path.startsWith("/api/") ||
      req.path.startsWith("/health")
    ) {
      return res.status(404).json({
        error: "Not Found",
        message: `API route ${req.method} ${req.path} not found`,
      });
    }

    res.sendFile(path.join(distPath, "index.html"));
  });
}

// =============================
// ERROR HANDLER
// =============================
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
  });
});

// =============================
// SERVER START
// =============================
const PORT = process.env.PORT || 8000;

async function startServer() {
  logger.info("Starting Backend Server...");
  logDatabaseConfig();

  const dbConnected = await testConnection();
  if (!dbConnected) {
    logger.error("Database connection failed. Exiting...");
    process.exit(1);
  }

  // ✅ Initialize database tables on startup
  try {
    logger.info("Initializing database schema...");
    await initializeDatabase();
    logger.info("✅ Database schema initialized successfully");
  } catch (error) {
    logger.error("Database initialization failed:", error.message);
    logger.warn("⚠️ Continuing anyway - tables might already exist");
  }

  app.listen(PORT, () => {
    logger.info(`🚀 Server running at http://localhost:${PORT}`);
    if (fs.existsSync(distPath)) {
      logger.info(`Frontend available at http://localhost:${PORT}`);
    } else {
      logger.info(`Frontend dev server (Vite) usually runs at http://localhost:5173`);
    }
    logger.info(`API base URL: http://localhost:${PORT}`);
  });
}

startServer();

export default app;
export { query, pool };
