# Render Deployment Guide

## Backend Deployment to Render

### Step 1: Prepare Your Code
1. Make sure your code is pushed to GitHub
2. All dependencies are in `package.json`

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click **"New +"** → **"Blueprint"** (or **"Web Service"**)
4. Connect your GitHub repository: `Eswar797/I-Love-PDF`
5. Render will auto-detect `render.yaml` configuration

### Step 3: Configure Backend Service
If using Blueprint, Render will auto-configure from `render.yaml`.
If creating manually:
1. Set **Root Directory**: `server`
2. Set **Build Command**: `npm install`
3. Set **Start Command**: `npm start`
4. Add environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `3001`

### Step 4: Get Your Backend URL
1. After deployment, Render will provide a URL like: `https://pdf-backend-3c5m.onrender.com`
2. Copy this URL - you'll need it for the frontend
3. **Your Backend URL:** `https://pdf-backend-3c5m.onrender.com`
4. **Note:** Free tier services spin down after 15 minutes of inactivity

### Step 5: Deploy Frontend to Render (Static Site)
1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository: `Eswar797/I-Love-PDF`
3. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add Environment Variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://pdf-backend-3c5m.onrender.com`
5. Click **"Create Static Site"**

## Environment Variables

### Backend:
- `NODE_ENV` = `production`
- `PORT` = Railway auto-assigns (default: 3001)
- `FRONTEND_URL` = Your frontend URL (if deploying separately)

### Frontend:
- `VITE_API_URL` = `https://pdf-backend-3c5m.onrender.com`

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

## Render Tips

- Use Blueprint deployment for automatic configuration from `render.yaml`
- Free tier backend services spin down after 15 minutes (first request may be slow)
- Static sites are always available (no spin-down)
- Check Render dashboard for logs and metrics
- Consider upgrading to paid plan for always-on backend in production
