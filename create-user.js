import bcrypt from "bcrypt";
import { pool } from "./db.config.js";

/**
 * Create user account script
 * Usage: node create-user.js <email> <password> <full-name>
 */

async function createUser(email, password, fullName) {
  const client = await pool.connect();
  try {
    console.log(`\n📝 Creating user account...`);
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${fullName}`);
    
    // Check if user already exists
    const existingUser = await client.query(
      "SELECT id, email FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log(`❌ User already exists: ${email}`);
      console.log(`\n💡 To reset password, run:`);
      console.log(`   node reset-password.js ${email} <new-password>`);
      return false;
    }

    // Validate password length
    if (password.length < 6) {
      console.log(`❌ Password must be at least 6 characters long`);
      return false;
    }

    // Hash password
    console.log(`🔒 Hashing password...`);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await client.query(
      `INSERT INTO users (full_name, email, password, signup_type, email_verified, sms_verified, verified)
       VALUES ($1, $2, $3, 'normal', false, false, false)
       RETURNING id, email, full_name, created_at`,
      [fullName, email.toLowerCase(), hashedPassword]
    );

    const user = result.rows[0];
    console.log(`✅ User created successfully!`);
    console.log(`\n📝 Account details:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.full_name}`);
    console.log(`   Created: ${user.created_at}`);
    console.log(`\n🔑 Login credentials:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`\n✅ You can now log in with these credentials!`);

    return true;
  } catch (error) {
    console.error(`❌ Error creating user:`, error.message);
    return false;
  } finally {
    client.release();
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log(`\n📖 Usage: node create-user.js <email> <password> <full-name>`);
  console.log(`\nExample:`);
  console.log(`   node create-user.js rupa@gmail.com Password123 "Rupa User"`);
  process.exit(1);
}

const [email, password, ...nameParts] = args;
const fullName = nameParts.join(" ");

if (password.length < 6) {
  console.log(`❌ Password must be at least 6 characters long`);
  process.exit(1);
}

createUser(email, password, fullName)
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error(`❌ Fatal error:`, error);
    process.exit(1);
  });
