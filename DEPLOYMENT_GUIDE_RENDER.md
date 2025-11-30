# 🚀 Render Backend Deployment Guide

## Why Render?
- **Truly free tier** for Node.js backends
- Auto-deploys from GitHub
- Neon PostgreSQL integration
- Perfect for seasonal/limited-use apps like your Christmas game

## Step-by-Step Instructions

### 1. Prepare Your GitHub Repository
- ✅ Code is already pushed to GitHub at https://github.com/HjalteSkovrup/christmas-game
- All changes are committed

### 2. Create Render Account & Connect GitHub
1. Go to https://render.com
2. Click **"Sign up"** → **"GitHub"**
3. Authorize Render to access your GitHub account
4. You'll be redirected to Render dashboard

### 3. Create New Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Find and select `christmas-game` repository
4. Click **"Connect"**

### 4. Configure Render Service

Fill in the deployment settings:

**Basic Settings:**
- **Name**: `christmas-game-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users (e.g., `Frankfurt` for EU)
- **Branch**: `main`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

### 5. Add Environment Variables

Click **"Environment"** and add:

```
DATABASE_URL=
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-app.vercel.app
PORT=3000
```

**Important Notes:**
- Render uses port `3000` by default (not 5000)
- Replace `https://your-vercel-app.vercel.app` with your actual Vercel URL (after Phase 4)

### 6. Deploy
1. Click **"Create Web Service"**
2. Render will auto-deploy (2-3 minutes)
3. Watch the deployment logs

### 7. Get Your Backend URL
- Once deployed, Render provides a URL like: `https://christmas-game-backend.onrender.com`
- Save this URL — you'll need it for frontend deployment

### 8. Verify Deployment

Test the health endpoint:
```bash
curl https://your-render-url/api/health
```

Expected response:
```json
{ "status": "ok" }
```

---

## Important: Update PORT in Backend

Your backend currently uses `PORT=5000`. Render needs it to listen on `3000` or the port Render assigns.

Update `backend/src/server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

---

## Expected Deployment Time: 2-5 minutes

## How the Free Tier Works

- **Free forever** ✅
- Auto-spins down after 15 min inactivity (slight startup delay on first request)
- Perfect for your December-only use case
- For a Christmas game, users expect 24 hours of uptime anyway

---

## Troubleshooting

**Issue: Build fails**
- Check logs in Render dashboard
- Verify `backend/package.json` exists
- Ensure build command is correct

**Issue: Database connection fails**
- Verify `DATABASE_URL` is correct
- Check Neon database is running
- Test connection locally: `node backend/src/db/verify-production.js`

**Issue: Port errors**
- Make sure `PORT=3000` in environment variables
- Update backend to use `process.env.PORT || 3000`

**Issue: CORS errors**
- Update `CORS_ORIGIN` to match your Vercel frontend URL
- Make sure it starts with `https://`

---

## What Happens After Deployment

1. Backend will be live on Render (free tier)
2. All API endpoints will be accessible:
   - `/api/health` - Health check
   - `/api/puzzles/:day` - Get puzzle by day
   - `/api/submissions` - Submit answer
   - `/api/leaderboard` - Get leaderboard

3. Database queries will use the Neon PostgreSQL connection

## After Render Deployment

Save your Render backend URL (e.g., `https://christmas-game-backend.onrender.com`) and proceed to:
- **Next step**: Deploy frontend to Vercel (Phase 4)

---

## Render Dashboard Features

Once deployed:
- **Logs** tab: Real-time server logs
- **Metrics** tab: CPU, memory, bandwidth usage
- **Settings** tab: Update environment variables, redeploy, etc.
- **Events** tab: Deployment history

You can manually redeploy anytime by clicking **"Manual Deploy"** → **"Deploy latest"** in the Settings tab.
