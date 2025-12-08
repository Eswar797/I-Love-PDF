# Railway Deployment Guide

## Backend Deployment to Railway

### Step 1: Prepare Your Code
1. Make sure your code is pushed to GitHub
2. All dependencies are in `package.json`

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository

### Step 3: Configure Backend Service
1. Railway will auto-detect Node.js
2. Click on the service → **Settings**
3. Set **Root Directory**: `server`
4. Set **Start Command**: `npm start` (or leave default)
5. Go to **Variables** tab
6. Add environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `3001` (Railway will auto-assign, but set this for consistency)

### Step 4: Get Your Backend URL
1. After deployment, Railway will provide a URL like: `https://your-app.railway.app`
2. Copy this URL - you'll need it for the frontend

### Step 5: Deploy Frontend (Optional - Railway Static)
You can deploy frontend separately or serve it from backend:

**Option A: Deploy Frontend as Separate Service**
1. Add new service in Railway
2. Root Directory: `client`
3. Build Command: `npm install && npm run build`
4. Output Directory: `dist`
5. Add env: `VITE_API_URL=https://your-backend.railway.app`

**Option B: Serve Frontend from Backend (Recommended)**
- The backend is already configured to serve the frontend in production
- Just build the frontend and Railway will serve it:
  1. In Railway, add a build step: `cd client && npm install && npm run build`
  2. The backend will serve files from `client/dist`

## Environment Variables

### Backend:
- `NODE_ENV` = `production`
- `PORT` = Railway auto-assigns (default: 3001)
- `FRONTEND_URL` = Your frontend URL (if deploying separately)

### Frontend (if separate):
- `VITE_API_URL` = Your Railway backend URL

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Root directory set to `server`
- [ ] Environment variables added
- [ ] Backend deployed successfully
- [ ] Backend URL copied
- [ ] Frontend configured (if separate)
- [ ] Test the deployed app

## Troubleshooting

### Build Fails:
- Check Railway logs for errors
- Verify `package.json` has all dependencies
- Ensure Node.js version is compatible

### Backend Not Starting:
- Check logs in Railway dashboard
- Verify `PORT` environment variable
- Check if `uploads` directory exists

### CORS Errors:
- Set `FRONTEND_URL` environment variable to your frontend domain
- Or set CORS to allow all origins in production

### File Upload Issues:
- Check file size limits (100MB max)
- Verify `uploads` directory is writable
- Check Railway logs for errors

## Railway Tips

- Railway auto-detects Node.js projects
- You can use Railway's built-in PostgreSQL if needed
- Railway provides free tier with generous limits
- Check Railway dashboard for logs and metrics
