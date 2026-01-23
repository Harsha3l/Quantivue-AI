# Quick Start - Influencer Posts Feature

## What Was Added

### Backend
- ✅ Database schema (`database-schema-posts.sql`)
- ✅ Posts API routes (`routes/posts.routes.js`)
- ✅ File upload handling with Multer
- ✅ n8n webhook integration
- ✅ Static file serving for uploads

### Frontend
- ✅ Create Post page (`src/pages/CreatePost.tsx`)
- ✅ Posts List page (`src/pages/PostsList.tsx`)
- ✅ API functions (`src/lib/api.ts`)
- ✅ Dashboard sidebar link (`src/components/DashboardLayout.tsx`)
- ✅ Routes added to `src/App.tsx`

### n8n
- ✅ Workflow JSON (`n8n-workflows/post-automation-workflow.json`)

## Quick Setup

1. **Run Database Schema:**
   ```bash
   psql -U your_user -d your_database -f database-schema-posts.sql
   ```

2. **Add Environment Variables:**
   ```env
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/post-automation
   BACKEND_URL=http://localhost:8000
   ```

3. **Import n8n Workflow:**
   - Open n8n at `http://localhost:5678`
   - Import `n8n-workflows/post-automation-workflow.json`
   - Activate the workflow

4. **Start Backend:**
   ```bash
   npm run server
   ```

5. **Access Frontend:**
   - Navigate to `/dashboard/posts` to see posts
   - Navigate to `/dashboard/posts/create` to create a post

## Key Features

- Create posts with captions and media
- Select multiple platforms (Instagram, LinkedIn, YouTube, Facebook, X)
- Choose posting mode (Automatic or Approval Required)
- Schedule posts for future dates
- Track post status
- Approve/reject posts
- View post history

## API Endpoints

- `POST /api/posts` - Create post
- `GET /api/posts` - List posts
- `GET /api/posts/:id` - Get post details
- `POST /api/posts/:id/approve` - Approve post
- `POST /api/posts/:id/reject` - Reject post
- `POST /api/posts/:id/webhook-status` - n8n callback (automatic)

## Next Steps

1. Replace mock posting in n8n workflow with actual social media API integrations
2. Configure cloud storage for media files (optional)
3. Add more post management features (edit, delete, etc.)
4. Implement analytics and reporting

For detailed documentation, see `INFLUENCER_AUTOMATION_GUIDE.md`.
