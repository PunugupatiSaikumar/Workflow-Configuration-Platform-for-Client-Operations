# ⚡ Quick Deployment Guide

## Fastest Option: Railway (Backend) + Vercel (Frontend)

### Step 1: Deploy Backend to Railway (5 minutes)

1. **Go to https://railway.app** and sign up/login
2. **Click "New Project"** → **"Deploy from GitHub repo"**
3. **Select your repository**
4. **Configure:**
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npx prisma migrate deploy && npm run start`
5. **Add PostgreSQL:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway auto-sets DATABASE_URL
6. **Set Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-strong-secret>
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```
7. **Deploy** - Railway auto-deploys!

**Get your backend URL:** `https://your-app.railway.app`

### Step 2: Deploy Frontend to Vercel (3 minutes)

1. **Go to https://vercel.com** and sign up/login
2. **Click "Add New Project"** → **Import your GitHub repo**
3. **Configure:**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. **Set Environment Variable:**
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```
5. **Deploy** - Vercel auto-deploys!

**Get your frontend URL:** `https://your-app.vercel.app`

### Step 3: Update CORS

1. Go back to Railway backend settings
2. Update `CORS_ORIGIN` to your Vercel frontend URL
3. Redeploy backend

### Step 4: Initialize Database

1. In Railway, open backend service
2. Click "Deploy Logs" → "Open Shell"
3. Run:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

## Done! 🎉

Your app is now live:
- Frontend: https://your-app.vercel.app
- Backend: https://your-app.railway.app/api

## Next Steps:

1. **Change default passwords** (IMPORTANT!)
2. **Set up custom domain** (optional)
3. **Enable monitoring**
4. **Set up backups**

## Generate Strong JWT Secret:

```bash
openssl rand -base64 32
```

## Troubleshooting:

**Backend not connecting?**
- Check DATABASE_URL in Railway
- Verify migrations ran: `npx prisma migrate deploy`

**Frontend can't reach backend?**
- Check CORS_ORIGIN matches frontend URL
- Verify REACT_APP_API_URL is correct

**Login not working?**
- Make sure database is seeded: `npm run seed`
- Check backend logs in Railway
