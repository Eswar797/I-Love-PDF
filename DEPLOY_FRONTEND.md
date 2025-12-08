# Frontend Deployment Guide

## Your Backend URL
**Backend API:** https://pdf-backend-3c5m.onrender.com

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Prepare
1. Make sure code is pushed to GitHub
2. The `.env.production` file is already configured with your backend URL

### Step 2: Deploy
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your repository: `Eswar797/I-Love-PDF`
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Add Environment Variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://i-love-pdf-production-1719.up.railway.app`
7. Click **"Deploy"**

### Step 3: Done!
Vercel will automatically deploy and give you a URL like:
`https://your-app.vercel.app`

---

## Option 2: Deploy to Netlify

### Step 1: Prepare
1. Make sure code is pushed to GitHub
2. The `netlify.toml` is already configured

### Step 2: Deploy
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Select your repository: `Eswar797/I-Love-PDF`
5. Configure:
   - **Base directory:** `client`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist`
6. Add Environment Variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://pdf-backend-3c5m.onrender.com`
   - **Note:** The `/api` path will be automatically appended
7. Click **"Deploy site"**

### Step 3: Done!
Netlify will deploy and give you a URL like:
`https://your-app.netlify.app`

---

## Option 3: Deploy Frontend to Railway (Same Platform)

### Step 1: Add New Service
1. In Railway dashboard, click **"New"** → **"Service"**
2. Select your GitHub repository: `Eswar797/I-Love-PDF`

### Step 2: Configure
1. Set **Root Directory:** `client`
2. Set **Build Command:** `npm install && npm run build`
3. Set **Start Command:** `npm run preview` (or use a static file server)
4. Add Environment Variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://pdf-backend-3c5m.onrender.com`

### Step 3: Deploy
Railway will build and deploy your frontend

---

## Environment Variables

Make sure to set this in your deployment platform:
- **VITE_API_URL** = `https://i-love-pdf-production-1719.up.railway.app`

---

## Testing After Deployment

1. Visit your frontend URL
2. Open browser console (F12)
3. Check for any CORS errors
4. Test a PDF tool (e.g., Merge PDF)
5. Verify it connects to the backend

---

## Troubleshooting

### CORS Errors
- Backend CORS is configured to allow all origins (`*`)
- If you see CORS errors, check backend logs

### API Connection Failed
- Verify `VITE_API_URL` is set correctly
- Check backend is running: https://pdf-backend-3c5m.onrender.com/api/health
- Check browser console for errors

### Build Errors
- Make sure all dependencies are in `client/package.json`
- Check build logs in deployment platform

---

## Quick Deploy Commands

### Build Locally (Test):
```bash
cd client
npm install
VITE_API_URL=https://pdf-backend-3c5m.onrender.com npm run build
npm run preview
```

### Deploy to Vercel (CLI):
```bash
npm i -g vercel
cd client
vercel --prod
```

