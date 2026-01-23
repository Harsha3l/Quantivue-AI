import express from "express";
import jwt from "jsonwebtoken";
import { query } from "../index.js";

const router = express.Router();

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
    const userId = decoded?.userId;
    if (!userId) return res.status(401).json({ detail: "Invalid token" });

    req.user = { userId };
    next();
  } catch (e) {
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
}

router.get("/payment-methods", requireUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await query(
      `SELECT id, type, last4, expiry, email, upi_id, is_default
       FROM payment_methods
       WHERE user_id = $1
       ORDER BY is_default DESC, id DESC`,
      [userId]
    );
    return res.status(200).json(result.rows || []);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return res.status(500).json({ detail: "Failed to fetch payment methods" });
  }
});

router.post("/payment-methods", requireUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, last4, expiry, email, upi_id, is_default } = req.body || {};

    if (!type) return res.status(400).json({ detail: "Payment method type is required" });

    // if first method OR request says default -> set others to false
    const existing = await query(`SELECT COUNT(*)::int AS c FROM payment_methods WHERE user_id = $1`, [userId]);
    const hasAny = (existing.rows?.[0]?.c || 0) > 0;
    const makeDefault = Boolean(is_default) || !hasAny;

    if (makeDefault) {
      await query(`UPDATE payment_methods SET is_default = false WHERE user_id = $1`, [userId]);
    }

    const insert = await query(
      `INSERT INTO payment_methods (user_id, type, last4, expiry, email, upi_id, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, type, last4, expiry, email, upi_id, is_default`,
      [
        userId,
        String(type),
        last4 ? String(last4).slice(-4) : null,
        expiry ? String(expiry) : null,
        email ? String(email).toLowerCase() : null,
        upi_id ? String(upi_id) : null,
        makeDefault,
      ]
    );

    return res.status(201).json(insert.rows[0]);
  } catch (error) {
    console.error("Error adding payment method:", error);
    return res.status(500).json({ detail: "Failed to add payment method" });
  }
});

router.get("/subscriptions", requireUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await query(
      `SELECT id, name, price, status, next_billing
       FROM subscriptions
       WHERE user_id = $1
       ORDER BY id DESC`,
      [userId]
    );
    return res.status(200).json(result.rows || []);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return res.status(500).json({ detail: "Failed to fetch subscriptions" });
  }
});

router.get("/payment-history", requireUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    // Use existing payments table
    const result = await query(
      `SELECT id, amount, status, payment_method, transaction_id, created_at
       FROM payments
       WHERE user_id = $1
       ORDER BY id DESC
       LIMIT 100`,
      [userId]
    );
    return res.status(200).json(result.rows || []);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({ detail: "Failed to fetch payment history" });
  }
});

export default router;

