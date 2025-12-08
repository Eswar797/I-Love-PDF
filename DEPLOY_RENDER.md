# Render Deployment Guide

## Backend Deployment to Render

### Step 1: Prepare Your Code
1. Make sure your code is pushed to GitHub
2. The `render.yaml` file is already configured

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click **"New +"** → **"Blueprint"** (or **"Web Service"**)
4. Connect your GitHub repository: `Eswar797/I-Love-PDF`
5. Render will detect `render.yaml` automatically

### Step 3: Configure Service (if not using Blueprint)
If you're creating a Web Service manually:
1. **Name:** `pdf-backend`
2. **Environment:** `Node`
3. **Root Directory:** `server`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. **Plan:** Free
7. **Environment Variables:**
   - `NODE_ENV` = `production`
   - `PORT` = `3001` (Render will auto-assign, but set for consistency)

### Step 4: Get Your Backend URL
1. After deployment, Render will provide a URL like: `https://pdf-backend.onrender.com`
2. Copy this URL - you'll need it for the frontend
3. Note: Free tier services spin down after 15 minutes of inactivity

### Step 5: Deploy Frontend to Render (Static Site)
1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository: `Eswar797/I-Love-PDF`
3. Configure:
   - **Name:** `pdf-frontend`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add Environment Variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://pdf-backend.onrender.com` (your backend URL)
5. Click **"Create Static Site"**

## Environment Variables

### Backend:
- `NODE_ENV` = `production`
- `PORT` = Render auto-assigns (default: 3001)

### Frontend:
- `VITE_API_URL` = Your Render backend URL (e.g., `https://pdf-backend.onrender.com`)

## Render Free Tier Notes

- **Backend:** Services spin down after 15 minutes of inactivity
- **First request** after spin-down may take 30-60 seconds to wake up
- **Static sites** are always available (no spin-down)
- Consider upgrading to paid plan for always-on backend

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Backend service deployed
- [ ] Backend URL copied
- [ ] Frontend service deployed
- [ ] Environment variables set
- [ ] Test the deployed app

## Troubleshooting

### Backend Not Starting:
- Check Render logs for errors
- Verify `PORT` environment variable
- Check if `uploads` directory exists
- Ensure dependencies are in `server/package.json`

### CORS Errors:
- Backend CORS is configured to allow all origins (`*`)
- Check browser console for specific errors
- Verify `VITE_API_URL` is set correctly in frontend

### Slow First Request:
- Normal on free tier (service wakes up)
- First request takes 30-60 seconds
- Subsequent requests are fast

### Build Fails:
- Check Render build logs
- Verify Node.js version compatibility
- Ensure all dependencies are in `package.json`

## Render Tips

- Use Blueprint deployment for automatic configuration
- Check Render dashboard for logs and metrics
- Free tier is great for testing and small projects
- Upgrade to paid plan for production use (always-on backend)

