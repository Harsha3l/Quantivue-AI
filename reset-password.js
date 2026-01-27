import bcrypt from "bcrypt";
import { pool } from "./db.config.js";

/**
 * Reset user password script
 * Usage: node reset-password.js <email> <new-password>
 */

async function resetPassword(email, newPassword) {
  const client = await pool.connect();
  try {
    console.log(`\n🔐 Resetting password for: ${email}`);
    
    // Check if user exists
    const userResult = await client.query(
      "SELECT id, email FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log(`❌ User not found: ${email}`);
      console.log(`\n💡 Would you like to create this user?`);
      console.log(`   Run: node create-user.js ${email} <password> <full-name>`);
      return false;
    }

    const user = userResult.rows[0];
    console.log(`✅ User found: ${user.email} (ID: ${user.id})`);

    // Hash the new password
    console.log(`🔒 Hashing new password...`);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await client.query(
      `UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [hashedPassword, user.id]
    );

    console.log(`✅ Password reset successfully!`);
    console.log(`\n📝 Login credentials:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}`);
    console.log(`\n⚠️  Please change this password after logging in for security.`);

    return true;
  } catch (error) {
    console.error(`❌ Error resetting password:`, error.message);
    return false;
  } finally {
    client.release();
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`\n📖 Usage: node reset-password.js <email> <new-password>`);
  console.log(`\nExample:`);
  console.log(`   node reset-password.js rupa@gmail.com NewPass123!`);
  process.exit(1);
}

const [email, newPassword] = args;

if (newPassword.length < 6) {
  console.log(`❌ Password must be at least 6 characters long`);
  process.exit(1);
}

resetPassword(email, newPassword)
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error(`❌ Fatal error:`, error);
    process.exit(1);
  });
