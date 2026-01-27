import dotenv from "dotenv";
dotenv.config();
import { query, pool } from "./db.config.js";
import bcrypt from "bcrypt";

async function testAuth() {
  console.log("🧪 Starting Auth Diagnostics...");
  const testEmail = "testuser_diagnostic@example.com";
  const testPassword = "password123";

  try {
    // 1. Cleanup previous run
    await query("DELETE FROM users WHERE email = $1", [testEmail]);

    // 2. Signup
    console.log("📝 Attempting signup...");
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    console.log("   Generated Hash:", hashedPassword);

    const signupResult = await query(
      `INSERT INTO users (full_name, email, password, signup_type, email_verified, sms_verified, verified)
       VALUES ($1, $2, $3, 'normal', false, false, false)
       RETURNING id, email, password`,
      ["Test User", testEmail, hashedPassword]
    );
    const user = signupResult.rows[0];
    console.log("✅ Signup successful. User ID:", user.id);
    console.log("   Stored Hash:", user.password);

    // 3. Login Simulation
    console.log("🔐 Attempting login verification...");
    const loginResult = await query(
      "SELECT password FROM users WHERE email = $1",
      [testEmail]
    );

    if (loginResult.rows.length === 0) {
      console.error("❌ Login failed: User not found in DB!");
      return;
    }

    const dbHash = loginResult.rows[0].password;
    console.log("   Retrieved Hash:", dbHash);

    const match = await bcrypt.compare(testPassword, dbHash);
    console.log("   Bcrypt Compare Result:", match);

    if (match) {
      console.log("✅ AUTH SYSTEM IS WORKING CORRECTLY.");
    } else {
      console.error("❌ AUTH SYSTEM FAILURE: Password does not match stored hash.");
    }

  } catch (error) {
    console.error("❌ Error during diagnostic:", error);
  } finally {
    // Cleanup
    await query("DELETE FROM users WHERE email = $1", [testEmail]);
    await pool.end();
  }
}

testAuth();
