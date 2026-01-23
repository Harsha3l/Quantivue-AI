# Influencer Social Media Automation Platform - Setup Guide

## Overview

This platform allows influencers to create, schedule, and automate social media posts across multiple platforms (Instagram, LinkedIn, YouTube, Facebook, X) with approval workflows and n8n integration.

## Architecture

```
Frontend (React) → Backend (Node.js/Express) → PostgreSQL → n8n (Automation)
```

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- n8n running on `http://localhost:5678`
- Environment variables configured

## Setup Steps

### 1. Database Setup

Run the database schema to create the required tables:

```bash
psql -U your_user -d your_database -f database-schema-posts.sql
```

Or manually execute the SQL in `database-schema-posts.sql`.

**Tables Created:**
- `posts` - Main post information
- `post_platforms` - Platform-specific post data
- `media_files` - Uploaded media metadata
- `post_approvals` - Approval/rejection history

### 2. Environment Variables

Add these to your `.env` file:

```env
# Database (already configured)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password

# JWT (already configured)
JWT_SECRET=your_jwt_secret

# n8n Integration
N8N_WEBHOOK_URL=http://localhost:5678/webhook/post-automation
N8N_WEBHOOK_SECRET=your_webhook_secret_optional
N8N_BASE_URL=http://localhost:5678
N8N_EMAIL=your_n8n_email
N8N_PASSWORD=your_n8n_password

# Backend URL (for callbacks)
BACKEND_URL=http://localhost:8000
```

### 3. Install Dependencies

```bash
npm install
```

Multer should already be installed. If not:
```bash
npm install multer
```

### 4. n8n Workflow Setup

1. Open n8n at `http://localhost:5678`
2. Create a new workflow
3. Import the workflow from `n8n-workflows/post-automation-workflow.json`
   - Or manually create a webhook trigger with path: `post-automation`
4. Configure the webhook to accept POST requests
5. Activate the workflow

**Workflow Features:**
- Webhook trigger receives post data
- Handles approval vs automatic modes
- Implements scheduling with Wait node
- Routes to platform-specific posting nodes
- Sends status callbacks to backend

### 5. Start the Application

**Backend:**
```bash
npm run server
# or
node index.js
```

**Frontend (development):**
```bash
npm run dev
```

**Frontend (production):**
```bash
npm run build
npm run server  # Serves both frontend and backend
```

## API Endpoints

### POST /api/posts
Create a new post

**Request (FormData):**
```
caption: string (required)
platforms: JSON array (required) - ["instagram", "linkedin", ...]
postingMode: "automatic" | "approval_required" (required)
scheduledAt: ISO 8601 datetime string (optional)
media: File[] (required, max 10 files, 100MB each)
```

**Response:**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "user_id": 1,
    "caption": "My post caption",
    "status": "pending_approval",
    "platforms": [...],
    "media": [...]
  }
}
```

### GET /api/posts
List all posts for authenticated user

**Query Parameters:**
- `status` (optional): Filter by status
- `platform` (optional): Filter by platform

**Response:**
```json
{
  "posts": [...],
  "count": 10
}
```

### GET /api/posts/:id
Get post details by ID

### POST /api/posts/:id/approve
Approve a pending post

### POST /api/posts/:id/reject
Reject a pending post

**Request Body:**
```json
{
  "reason": "Rejection reason"
}
```

### POST /api/posts/:id/status
Webhook endpoint for n8n to update post status (internal use)

## Post Statuses

- `draft` - Post created but not scheduled
- `pending_approval` - Waiting for approval (approval_required mode)
- `scheduled` - Scheduled for future posting
- `posted` - Successfully posted to all platforms
- `failed` - Failed to post to one or more platforms

## Frontend Routes

- `/dashboard/posts` - List all posts
- `/dashboard/posts/create` - Create new post

## File Uploads

- **Location:** `uploads/media/`
- **Max file size:** 100MB per file
- **Max files:** 10 per post
- **Supported formats:**
  - Images: JPG, PNG, GIF, WebP
  - Videos: MP4, MOV, AVI, WebM

## n8n Integration Flow

1. **Post Creation:**
   - User creates post via frontend
   - Backend saves to database
   - Backend triggers n8n webhook with post data

2. **n8n Processing:**
   - Webhook receives post data
   - Checks approval mode (if approval_required, waits)
   - Checks scheduled time (if scheduled, waits)
   - Splits into platform-specific items
   - Posts to each platform (mock implementation)
   - Sends status callback to backend

3. **Status Updates:**
   - n8n sends POST to `/api/posts/:id/status`
   - Backend updates post and platform statuses
   - Frontend reflects updated status

## Mock Social Media Posting

The n8n workflow includes mock posting functions for each platform. In production, replace these with actual API integrations:

- **Instagram:** Instagram Graph API
- **LinkedIn:** LinkedIn API v2
- **YouTube:** YouTube Data API v3
- **Facebook:** Facebook Graph API
- **X (Twitter):** Twitter API v2

## Error Handling

- All API endpoints include proper error handling
- File uploads validate size and type
- Database transactions ensure data consistency
- n8n failures are logged but don't block post creation

## Security

- JWT authentication required for all endpoints
- File uploads validated for type and size
- SQL injection prevention via parameterized queries
- Webhook secret verification (optional but recommended)

## Troubleshooting

**Posts not appearing:**
- Check database connection
- Verify user authentication token
- Check browser console for errors

**File uploads failing:**
- Verify `uploads/media/` directory exists
- Check file size limits
- Verify file type is supported

**n8n not triggering:**
- Verify n8n is running
- Check `N8N_WEBHOOK_URL` environment variable
- Verify workflow is activated in n8n
- Check n8n execution logs

**Status not updating:**
- Verify callback URL is correct
- Check n8n workflow execution
- Verify webhook secret matches (if configured)

## Next Steps

1. Replace mock posting with real API integrations
2. Add email notifications for approvals
3. Implement retry logic for failed posts
4. Add analytics and reporting
5. Implement media optimization (resize, compress)
6. Add support for more platforms

## Support

For issues or questions, check:
- Backend logs: Console output
- n8n logs: n8n execution history
- Database: Check PostgreSQL logs
- Frontend: Browser developer console
