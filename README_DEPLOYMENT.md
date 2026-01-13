# 🚀 Quick Production Deployment

## Fastest Way: Railway + Vercel (Recommended)

### ⏱️ Total Time: ~10 minutes

### Step 1: Deploy Backend (Railway) - 5 min

1. **Sign up**: https://railway.app
2. **New Project** → **Deploy from GitHub**
3. **Select your repo**
4. **Settings**:
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npx prisma migrate deploy && npm run start`
5. **Add Database**: New → Database → PostgreSQL
6. **Environment Variables**:
   ```
   NODE_ENV=production
   JWT_SECRET=<run: openssl rand -base64 32>
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```
7. **Deploy** - Auto-deploys on git push!

**Backend URL**: `https://your-app.railway.app`

### Step 2: Deploy Frontend (Vercel) - 3 min

1. **Sign up**: https://vercel.com
2. **Add New Project** → **Import GitHub repo**
3. **Settings**:
   - Framework: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. **Environment Variable**:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```
5. **Deploy** - Auto-deploys!

**Frontend URL**: `https://your-app.vercel.app`

### Step 3: Update CORS - 1 min

1. Railway → Backend → Variables
2. Update `CORS_ORIGIN` = your Vercel URL
3. Redeploy

### Step 4: Initialize Database - 1 min

1. Railway → Backend → Deploy Logs → Shell
2. Run:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

## ✅ Done!

Your app is live:
- 🌐 Frontend: https://your-app.vercel.app
- 🔌 Backend: https://your-app.railway.app/api
- 📚 API Docs: https://your-backend.railway.app/api-docs

## 🔐 IMPORTANT: Change Default Passwords!

After deployment, immediately change:
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

## 📋 Full Deployment Guide

See `DEPLOYMENT_GUIDE.md` for:
- Heroku deployment
- AWS deployment
- Docker deployment
- Security checklist
- Monitoring setup

## 🆘 Need Help?

Check `PRODUCTION_CHECKLIST.md` for complete checklist.
