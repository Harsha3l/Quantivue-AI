-- ============================================
-- Influencer Social Media Automation Platform
-- Database Schema for Posts, Media, and Approvals
-- ============================================

-- Posts Table: Main post information
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Post Platforms Table: Platform-specific post data
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

-- Media Files Table: Uploaded media metadata
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

-- Post Approvals Table: Approval/rejection history
CREATE TABLE IF NOT EXISTS post_approvals (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  approver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(20) NOT NULL CHECK (action IN ('approved', 'rejected')),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_post_platforms_post_id ON post_platforms(post_id);
CREATE INDEX IF NOT EXISTS idx_post_platforms_platform ON post_platforms(platform);
CREATE INDEX IF NOT EXISTS idx_media_files_post_id ON media_files(post_id);
CREATE INDEX IF NOT EXISTS idx_post_approvals_post_id ON post_approvals(post_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_platforms_updated_at BEFORE UPDATE ON post_platforms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
