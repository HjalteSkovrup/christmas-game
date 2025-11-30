# 🚀 Railway Backend Deployment Guide

## Step-by-Step Instructions

### 1. Prepare Your GitHub Repository
- ✅ Code is already pushed to GitHub (assumed)
- All changes are committed

### 2. Connect to Railway (First Time)
1. Go to https://railway.app
2. Sign in with your GitHub account
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Authorize Railway to access your GitHub account
6. Select the `christmas-game` repository
7. Select `backend` folder as the root directory

### 3. Configure Environment Variables in Railway

Add these environment variables in Railway dashboard:

```
DATABASE_URL=
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-app.vercel.app
PORT=5000
```

**Important:** Replace `https://your-vercel-app.vercel.app` with your actual Vercel frontend URL (you'll get this in Phase 4)

### 4. Configure Railway Settings

In Railway project settings:
- **Start command**: `npm start`
- **Root directory**: `backend` (if not already set)
- **Node version**: 18+ (should be auto-detected)

### 5. Deploy
- Railway will automatically deploy when you:
  - Push to main branch, OR
  - Manually trigger deployment from Railway dashboard

### 6. Get Your Backend URL
- Once deployed, Railway will provide a URL like: `https://backend-production.up.railway.app`
- Save this URL - you'll need it for frontend deployment

### 7. Verify Deployment

Test the health endpoint:
```bash
curl https://your-railway-url/api/health
```

Expected response:
```json
{ "status": "ok" }
```

---

## Expected Deployment Time: 2-5 minutes

## Troubleshooting

**Issue: Build fails**
- Check that `backend/package.json` exists
- Verify Node version compatibility
- Check Railway logs for specific errors

**Issue: Database connection fails**
- Verify `DATABASE_URL` is correct
- Check Neon database is running
- Ensure IP allowlist on Neon includes Railway IPs (usually automatic)

**Issue: CORS errors**
- Update `CORS_ORIGIN` to match your Vercel frontend URL
- Make sure it starts with `https://`

---

## What Happens After Deployment

1. Backend will be live on Railway
2. All API endpoints will be accessible:
   - `/api/health` - Health check
   - `/api/puzzles/:day` - Get puzzle by day
   - `/api/submissions` - Submit answer
   - `/api/leaderboard` - Get leaderboard

3. Database queries will use the Neon PostgreSQL connection

Next step: Deploy frontend to Vercel (Phase 4)
