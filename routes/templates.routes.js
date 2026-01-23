import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// templates folder is at repo root: ./templates
const templatesDir = path.resolve(__dirname, "..", "templates");

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

function titleFromFileBase(fileBase) {
  return fileBase
    .replace(/__/g, " - ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function listTemplateFiles() {
  if (!fs.existsSync(templatesDir)) return [];
  return fs
    .readdirSync(templatesDir)
    .filter((f) => f.toLowerCase().endsWith(".json"))
    .sort((a, b) => a.localeCompare(b));
}

router.get("/", requireUser, async (req, res) => {
  try {
    const search = String(req.query.search || "").trim().toLowerCase();
    const files = listTemplateFiles();

    const templates = files
      .map((file) => {
        const id = path.basename(file, ".json");
        return { id, name: titleFromFileBase(id) };
      })
      .filter((t) => {
        if (!search) return true;
        return t.id.toLowerCase().includes(search) || t.name.toLowerCase().includes(search);
      });

    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error listing templates:", error);
    return res.status(500).json({ detail: "Failed to list templates" });
  }
});

router.get("/:id", requireUser, async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) return res.status(400).json({ detail: "Missing template id" });

    const filePath = path.join(templatesDir, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ detail: "Template not found" });
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(raw);
    return res.status(200).json(json);
  } catch (error) {
    console.error("Error reading template:", error);
    return res.status(500).json({ detail: "Failed to read template" });
  }
});

router.get("/:id/download", requireUser, async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) return res.status(400).json({ detail: "Missing template id" });

    const filePath = path.join(templatesDir, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ detail: "Template not found" });
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${id}.json"`);
    return fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error("Error downloading template:", error);
    return res.status(500).json({ detail: "Failed to download template" });
  }
});

export default router;

