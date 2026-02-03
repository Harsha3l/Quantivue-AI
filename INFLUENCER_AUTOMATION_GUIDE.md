# Influencer Social Media Automation Platform - Complete Guide

## Overview

This platform enables influencers to create, schedule, and automate social media posts across multiple platforms (Instagram, LinkedIn, YouTube, Facebook, X) with approval workflows and n8n integration.

## Architecture

```
Frontend (React) → Backend (Node.js/Express) → PostgreSQL → n8n (Automation)
```

## Features

- **Post Creation**: Create posts with captions, media uploads, and platform selection
- **Posting Modes**: 
  - Automatic: Posts are published immediately or at scheduled time
  - Approval Required: Posts require approval before publishing
- **Scheduling**: Schedule posts for future dates and times
- **Multi-Platform**: Post to Instagram, LinkedIn, YouTube, Facebook, and X simultaneously
- **Status Tracking**: Track post status (Draft, Pending Approval, Scheduled, Posted, Failed, Rejected)
- **Media Management**: Upload and manage images and videos (up to 100MB per file)
- **n8n Integration**: Automated workflow execution for posting and status updates

## Setup Instructions

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

Dependencies should already be installed. If not:

```bash
npm install
```

### 4. n8n Workflow Setup

1. Open n8n at `https://quantivue-n8n.onrender.com`
2. Create a new workflow
3. Import the workflow from `n8n-workflows/post-automation-workflow.json`
   - Or manually create a webhook trigger with path: `post-automation`
4. Configure the webhook to accept POST requests
5. Activate the workflow

**Note**: The current workflow uses mock posting. Replace the "Mock Social Media Post" node with actual API integrations for production use.

### 5. Start the Application

**Backend:**
```bash
npm run server
# or
node index.js
```

**Frontend (Development):**
```bash
npm run dev
```

**Frontend (Production):**
```bash
npm run build
npm run preview
```

## API Endpoints

### POST /api/posts
Create a new post with media upload.

**Request:**
- Method: `POST`
- Headers: `Authorization: Bearer <token>`
- Body: `FormData`
  - `caption` (string, required)
  - `platforms` (JSON array, required): `["instagram", "linkedin", ...]`
  - `postingMode` (string, required): `"automatic"` or `"approval"`
  - `scheduledAt` (ISO string, optional)
  - `media` (File[], optional): Image or video files

**Response:**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "caption": "My post caption",
    "status": "pending_approval",
    "platforms": [...],
    "mediaFiles": [...]
  }
}
```

### GET /api/posts
List all posts for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter by status
- `platform` (optional): Filter by platform
- `limit` (optional, default: 50)
- `offset` (optional, default: 0)

**Response:**
```json
[
  {
    "id": 1,
    "caption": "My post",
    "status": "posted",
    "platforms": [...],
    "media_count": 2
  }
]
```

### GET /api/posts/:id
Get a single post with full details.

**Response:**
```json
{
  "id": 1,
  "caption": "My post",
  "status": "posted",
  "platforms": [...],
  "mediaFiles": [...],
  "approvals": [...]
}
```

### POST /api/posts/:id/approve
Approve a post (for approval mode).

**Request Body:**
```json
{
  "comment": "Looks good!" // optional
}
```

### POST /api/posts/:id/reject
Reject a post (for approval mode).

**Request Body:**
```json
{
  "comment": "Needs revision" // optional
}
```

### POST /api/posts/:id/webhook-status
Webhook endpoint for n8n to update post status (called automatically by n8n).

**Request Body:**
```json
{
  "status": "posted",
  "platformStatuses": [
    {
      "platform": "instagram",
      "status": "posted",
      "platformPostId": "123456",
      "error": null
    }
  ],
  "errorMessage": null,
  "n8nExecutionId": "exec_123"
}
```

## Frontend Routes

- `/dashboard/posts` - List all posts
- `/dashboard/posts/create` - Create a new post

## Post Status Flow

1. **Draft**: Post created but not submitted
2. **Pending Approval**: Post created with approval mode, waiting for approval
3. **Scheduled**: Post scheduled for future posting
4. **Posted**: Post successfully published to all selected platforms
5. **Failed**: Post failed to publish (error occurred)
6. **Rejected**: Post was rejected during approval

## n8n Workflow Logic

1. **Webhook Trigger**: Receives post data from backend
2. **Check Approval Mode**: 
   - If approval required, wait for approval (status remains pending)
   - If automatic, proceed to posting
3. **Check Scheduled**: 
   - If scheduled, wait until scheduled time
   - If immediate, proceed to posting
4. **Mock Post**: Simulates posting to social media platforms
5. **Callback**: Sends status update back to backend

**Note**: Replace the mock posting node with actual social media API integrations for production.

## File Upload

- **Supported Formats**: JPG, PNG, GIF, WebP, MP4, MOV, AVI
- **Max File Size**: 100MB per file
- **Storage**: Files are stored in `uploads/media/` directory
- **Access**: Files are served at `/uploads/media/<filename>`

## Security Considerations

1. **Authentication**: All API endpoints require JWT authentication
2. **File Validation**: Files are validated for type and size
3. **Webhook Security**: Optional webhook secret for n8n callbacks
4. **User Ownership**: Users can only access their own posts

## Troubleshooting

### Posts not appearing
- Check database connection
- Verify user authentication
- Check browser console for errors

### File upload fails
- Verify file size is under 100MB
- Check file type is supported
- Ensure `uploads/media/` directory exists and is writable

### n8n webhook not working
- Verify n8n is running on `https://quantivue-n8n.onrender.com`
- Check `N8N_WEBHOOK_URL` in `.env`
- Ensure workflow is activated in n8n
- Check n8n execution logs

### Post status not updating
- Verify n8n workflow is calling the callback endpoint
- Check backend logs for webhook errors
- Ensure `BACKEND_URL` is correctly configured

## Production Deployment

1. **Database**: Use a production PostgreSQL database
2. **File Storage**: Consider using cloud storage (S3, Cloudinary) instead of local files
3. **n8n**: Deploy n8n on a separate server or use n8n Cloud
4. **Social Media APIs**: Replace mock posting with actual API integrations
5. **Environment Variables**: Use secure environment variable management
6. **HTTPS**: Enable HTTPS for all API endpoints
7. **Rate Limiting**: Implement rate limiting for API endpoints
8. **Monitoring**: Set up logging and monitoring for production

## Example Request/Response

### Create Post Request
```bash
curl -X POST http://localhost:8000/api/posts \
  -H "Authorization: Bearer <token>" \
  -F "caption=Check out my new post!" \
  -F "platforms=[\"instagram\",\"linkedin\"]" \
  -F "postingMode=automatic" \
  -F "scheduledAt=2024-12-31T12:00:00Z" \
  -F "media=@image.jpg"
```

### Create Post Response
```json
{
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "user_id": 1,
    "caption": "Check out my new post!",
    "posting_mode": "automatic",
    "status": "scheduled",
    "scheduled_at": "2024-12-31T12:00:00.000Z",
    "created_at": "2024-01-01T10:00:00.000Z",
    "platforms": [
      {
        "id": 1,
        "post_id": 1,
        "platform": "instagram",
        "platform_status": null
      },
      {
        "id": 2,
        "post_id": 1,
        "platform": "linkedin",
        "platform_status": null
      }
    ],
    "mediaFiles": [
      {
        "id": 1,
        "post_id": 1,
        "file_name": "image-1234567890-123456789.jpg",
        "file_path": "/path/to/uploads/media/image-1234567890-123456789.jpg",
        "file_type": "jpg",
        "file_size": 1024000,
        "mime_type": "image/jpeg",
        "url": "/uploads/media/image-1234567890-123456789.jpg"
      }
    ]
  }
}
```

## Support

For issues or questions, please check:
- Backend logs: Check console output when running `npm run server`
- Frontend logs: Check browser console (F12)
- n8n logs: Check n8n execution history in the n8n UI
