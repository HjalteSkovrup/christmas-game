# 🚀 Vercel Frontend Deployment Guide

## Why Vercel for Frontend?
- Optimized for React/Vite apps
- Automatic performance optimization
- Built-in CDN and edge caching
- Seamless GitHub integration
- Truly free tier
- Faster deployments

---

## Step-by-Step Instructions

### 1. Prerequisites
- ✅ Backend running on Render at `https://christmas-game.onrender.com`
- ✅ Code pushed to GitHub at `https://github.com/HjalteSkovrup/christmas-game`

### 2. Create Vercel Account
1. Go to https://vercel.com
2. Click **"Sign Up"** → **"GitHub"**
3. Authorize Vercel to access your GitHub account
4. You'll be redirected to Vercel dashboard

### 3. Import Your GitHub Repository
1. Click **"Add New..."** → **"Project"**
2. Search for `christmas-game` repository
3. Click **"Import"**

### 4. Configure Project Settings

**Before deployment, set these settings:**

- **Project Name**: `christmas-game` (or your preferred name)
- **Framework**: `Vite`
- **Root Directory**: `./frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5. Add Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://christmas-game.onrender.com
```

**Important:** This tells your frontend where to find the Render backend.

### 6. Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy (1-2 minutes)
3. Once complete, you'll get a deployment URL like: `https://christmas-game.vercel.app`

### 7. Verify Deployment

1. Visit your Vercel URL (e.g., `https://christmas-game.vercel.app`)
2. You should see the Christmas game UI
3. Try selecting Day 25 (test day - always unlocked)
4. Test a submission to verify backend connection

### 8. Update Render Backend CORS Settings

Now that you have your Vercel URL, update your Render backend to allow it:

1. Go to https://dashboard.render.com
2. Click your `christmas-game-backend` service
3. Go to **"Environment"** tab
4. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://christmas-game.vercel.app
   ```
5. **Save** (this will redeploy the backend automatically)

### 9. Test Full Stack

1. Refresh your Vercel frontend (clear browser cache if needed)
2. Try submitting an answer on Day 25:
   - ID: `testuser1`
   - Passkey: `testpass123`
   - Answer: `test`
3. You should see `✅ Correct!`
4. Check the leaderboard to verify real-time updates

---

## Expected Deployment Time

- **Build**: 1-2 minutes
- **Deployment**: < 1 minute
- **Total**: 2-3 minutes

## Troubleshooting

**Issue: Frontend shows 404 for API calls**
- Verify `VITE_API_URL` is set correctly in Vercel env variables
- Make sure it doesn't have a trailing slash: `https://christmas-game.onrender.com` ✅ (not `...com/`)
- Wait for Render backend CORS_ORIGIN update to complete

**Issue: CORS errors in browser console**
- Verify `CORS_ORIGIN` in Render backend matches your Vercel URL exactly
- Check that Render backend has redeployed after CORS update

**Issue: Submissions fail but day selector works**
- Backend is responding but submission endpoint may have an issue
- Check Render logs for errors
- Verify backend is still running: `https://christmas-game.onrender.com/api/health`

**Issue: Leaderboard shows no data**
- This is normal if no submissions have been made yet
- Make a test submission and leaderboard will update

---

## After Successful Deployment

Your system is now live:

```
┌─────────────────────────────────────────────┐
│        🎄 Christmas Game Live 🎄            │
├─────────────────────────────────────────────┤
│ Frontend:  https://christmas-game.vercel.app│
│ Backend:   https://christmas-game.onrender.com
│ Database:  Neon PostgreSQL (hosted)         │
└─────────────────────────────────────────────┘
```

## Next Steps

1. **Test thoroughly** on production URLs
2. **Generate participant credentials** (ID + Passkey pairs)
3. **Distribute to employees** via secure channel
4. **Monitor performance** during December 1-24
5. **Announce go-live** on December 1st

---

## Vercel Dashboard Features

Once deployed:
- **Deployments** tab: See all deployment history
- **Settings** tab: Configure domains, analytics, environment variables
- **Analytics** tab: View traffic and performance metrics
- **Logs** tab: Real-time function logs (if using serverless functions)

You can trigger manual redeploys or configure auto-deployments on every GitHub push.

---

## Custom Domain (Optional)

If you want a custom domain (e.g., `christmas.company.com`):
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `CORS_ORIGIN` on Render backend if needed

---

## Performance Tips

- Vercel automatically optimizes your build
- Images are served through their CDN
- JavaScript is minified and tree-shaken
- No additional configuration needed for Vite apps
