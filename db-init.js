import { pool } from './db.config.js';

/**
 * Initialize Database Tables
 * Run this once to set up the database schema
 */
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log('🔄 Initializing database...');

    // Drop existing tables (for development only)
    // await client.query('DROP TABLE IF EXISTS login_logs CASCADE');
    // await client.query('DROP TABLE IF EXISTS workflows CASCADE');
    // await client.query('DROP TABLE IF EXISTS payments CASCADE');
    // await client.query('DROP TABLE IF EXISTS users CASCADE');

    // Create Users Table
    await client.query(`
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
      );
    `);
    console.log('✅ Users table created/verified');

    // Add login_count column if it doesn't exist (migration for existing tables)
    try {
      await client.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'login_count'
          ) THEN
            ALTER TABLE users ADD COLUMN login_count INTEGER DEFAULT 0;
          END IF;
        END $$;
      `);
      console.log('✅ login_count column verified');
    } catch (e) {
      console.warn('⚠️ Could not verify login_count column:', e.message);
    }

    // Create Login Logs Table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS login_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ip_address VARCHAR(45),
          user_agent TEXT
        );
      `);
      console.log('✅ Login logs table created/verified (FK)');
    } catch (e) {
      // If an existing users.id is not compatible with INTEGER FK, fallback to a non-FK column
      console.warn('⚠️ login_logs FK could not be created, falling back to non-FK user_id:', e.message);
      await client.query(`
        CREATE TABLE IF NOT EXISTS login_logs (
          id SERIAL PRIMARY KEY,
          user_id TEXT,
          login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ip_address VARCHAR(45),
          user_agent TEXT
        );
      `);
      console.log('✅ Login logs table created/verified (no FK)');
    }

    // Create Payments Table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          payment_method VARCHAR(100),
          transaction_id VARCHAR(255) UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Payments table created/verified (FK)');
    } catch (e) {
      console.warn('⚠️ payments FK could not be created, falling back to non-FK user_id:', e.message);
      await client.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          user_id TEXT,
          amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          payment_method VARCHAR(100),
          transaction_id VARCHAR(255) UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Payments table created/verified (no FK)');
    }

    // Create Payment Methods Table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS payment_methods (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          last4 VARCHAR(4),
          expiry VARCHAR(10),
          email VARCHAR(255),
          upi_id VARCHAR(255),
          is_default BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Payment methods table created/verified (FK)');
    } catch (e) {
      console.warn('⚠️ payment_methods FK could not be created, falling back to non-FK user_id:', e.message);
      await client.query(`
        CREATE TABLE IF NOT EXISTS payment_methods (
          id SERIAL PRIMARY KEY,
          user_id TEXT,
          type VARCHAR(50) NOT NULL,
          last4 VARCHAR(4),
          expiry VARCHAR(10),
          email VARCHAR(255),
          upi_id VARCHAR(255),
          is_default BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Payment methods table created/verified (no FK)');
    }

    // Create Subscriptions Table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          price VARCHAR(50) NOT NULL,
          status VARCHAR(50) DEFAULT 'active',
          next_billing DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Subscriptions table created/verified (FK)');
    } catch (e) {
      console.warn('⚠️ subscriptions FK could not be created, falling back to non-FK user_id:', e.message);
      await client.query(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id SERIAL PRIMARY KEY,
          user_id TEXT,
          name VARCHAR(255) NOT NULL,
          price VARCHAR(50) NOT NULL,
          status VARCHAR(50) DEFAULT 'active',
          next_billing DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Subscriptions table created/verified (no FK)');
    }

    // Create Workflows Table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS workflows (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Workflows table created/verified (FK)');
    } catch (e) {
      console.warn('⚠️ workflows FK could not be created, falling back to non-FK user_id:', e.message);
      await client.query(`
        CREATE TABLE IF NOT EXISTS workflows (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          user_id TEXT,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Workflows table created/verified (no FK)');
    }

    // Create Websites Table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS websites (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          domain VARCHAR(255) NOT NULL,
          type VARCHAR(100) DEFAULT 'WordPress',
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Websites table created/verified (FK)');
    } catch (e) {
      console.warn('⚠️ websites FK could not be created, falling back to non-FK user_id:', e.message);
      await client.query(`
        CREATE TABLE IF NOT EXISTS websites (
          id SERIAL PRIMARY KEY,
          user_id TEXT,
          domain VARCHAR(255) NOT NULL,
          type VARCHAR(100) DEFAULT 'WordPress',
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Websites table created/verified (no FK)');
    }

    // Create Password Resets Table (for forgot/reset password)
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS password_resets (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          token VARCHAR(10) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_password_resets_email ON password_resets(LOWER(email));`);
      console.log('✅ Password resets table created/verified');
    } catch (e) {
      // If we don't have permission to create/modify password_resets table, log warning but continue
      console.warn('⚠️ Could not create/verify password_resets table (permissions issue):', e.message);
      console.warn('⚠️ Password reset functionality may not work properly');
    }

    // Create Contact Submissions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(LOWER(email));`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);`);
    console.log('✅ Contact submissions table created/verified');

    // Create Indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_websites_user_id ON websites(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_websites_domain ON websites(LOWER(domain));`);
    console.log('✅ Indexes created/verified');

    // Create Posts Tables (Influencer Platform)
    try {
      // Create update_updated_at_column function if it doesn't exist
      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);

      // Posts Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          caption TEXT,
          posting_mode VARCHAR(20) NOT NULL CHECK (posting_mode IN ('automatic', 'approval')),
          status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'scheduled', 'posted', 'failed', 'rejected')),
          scheduled_at TIMESTAMP,
          posted_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          n8n_workflow_id VARCHAR(255),
          n8n_execution_id VARCHAR(255),
          error_message TEXT
        );
      `);
      console.log('✅ Posts table created/verified');

      // Post Platforms Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS post_platforms (
          id SERIAL PRIMARY KEY,
          post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
          platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'linkedin', 'youtube', 'facebook', 'x')),
          platform_post_id VARCHAR(255),
          platform_status VARCHAR(50),
          platform_error TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(post_id, platform)
        );
      `);
      console.log('✅ Post platforms table created/verified');

      // Media Files Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS media_files (
          id SERIAL PRIMARY KEY,
          post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
          file_name VARCHAR(255) NOT NULL,
          file_path TEXT NOT NULL,
          file_type VARCHAR(50) NOT NULL,
          file_size BIGINT,
          mime_type VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Media files table created/verified');

      // Post Approvals Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS post_approvals (
          id SERIAL PRIMARY KEY,
          post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
          approver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          action VARCHAR(20) NOT NULL CHECK (action IN ('approved', 'rejected')),
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Post approvals table created/verified');

      // Create indexes for posts tables
      await client.query(`CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_post_platforms_post_id ON post_platforms(post_id);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_post_platforms_platform ON post_platforms(platform);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_media_files_post_id ON media_files(post_id);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_post_approvals_post_id ON post_approvals(post_id);`);

      // Create triggers for updated_at
      await client.query(`
        DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
        CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
      await client.query(`
        DROP TRIGGER IF EXISTS update_post_platforms_updated_at ON post_platforms;
        CREATE TRIGGER update_post_platforms_updated_at BEFORE UPDATE ON post_platforms
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('✅ Posts indexes and triggers created/verified');
    } catch (e) {
      console.warn('⚠️ Posts tables could not be created, falling back to non-FK user_id:', e.message);
      // Fallback: Create tables without foreign key constraints if user doesn't have permission
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER,
            caption TEXT,
            posting_mode VARCHAR(20) NOT NULL CHECK (posting_mode IN ('automatic', 'approval')),
            status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'scheduled', 'posted', 'failed', 'rejected')),
            scheduled_at TIMESTAMP,
            posted_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            n8n_workflow_id VARCHAR(255),
            n8n_execution_id VARCHAR(255),
            error_message TEXT
          );
        `);
        await client.query(`
          CREATE TABLE IF NOT EXISTS post_platforms (
            id SERIAL PRIMARY KEY,
            post_id INTEGER,
            platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'linkedin', 'youtube', 'facebook', 'x')),
            platform_post_id VARCHAR(255),
            platform_status VARCHAR(50),
            platform_error TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(post_id, platform)
          );
        `);
        await client.query(`
          CREATE TABLE IF NOT EXISTS media_files (
            id SERIAL PRIMARY KEY,
            post_id INTEGER,
            file_name VARCHAR(255) NOT NULL,
            file_path TEXT NOT NULL,
            file_type VARCHAR(50) NOT NULL,
            file_size BIGINT,
            mime_type VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        await client.query(`
          CREATE TABLE IF NOT EXISTS post_approvals (
            id SERIAL PRIMARY KEY,
            post_id INTEGER,
            approver_id INTEGER,
            action VARCHAR(20) NOT NULL CHECK (action IN ('approved', 'rejected')),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Posts tables created/verified (no FK)');
      } catch (fallbackError) {
        console.error('❌ Failed to create posts tables even without FK:', fallbackError.message);
      }
    }

    console.log('✅ Database initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Database setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}

export { initializeDatabase };
