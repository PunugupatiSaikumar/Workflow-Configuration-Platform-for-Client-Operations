# 🚀 Deploy Your App Now - Step by Step

## ⚡ Fastest Deployment: Railway + Vercel (~10 minutes)

### Prerequisites
- GitHub account (with your code pushed)
- Railway account (free tier available)
- Vercel account (free tier available)

---

## 📦 Step 1: Deploy Backend to Railway

### 1.1 Sign Up
- Go to: https://railway.app
- Sign up with GitHub

### 1.2 Create Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Click **"Deploy Now"**

### 1.3 Configure Backend
1. Click on the deployed service
2. Go to **Settings** tab
3. Set **Root Directory**: `backend`
4. Set **Build Command**: 
   ```
   npm install && npx prisma generate && npm run build
   ```
5. Set **Start Command**:
   ```
   npx prisma migrate deploy && npm run start
   ```

### 1.4 Add PostgreSQL Database
1. Click **"New"** button
2. Select **"Database"**
3. Choose **"PostgreSQL"**
4. Railway automatically sets `DATABASE_URL`

### 1.5 Set Environment Variables
Go to **Variables** tab and add:

```env
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

### 1.6 Get Backend URL
- Railway provides: `https://your-app.up.railway.app`
- Copy this URL - you'll need it for frontend!

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Sign Up
- Go to: https://vercel.com
- Sign up with GitHub

### 2.2 Import Project
1. Click **"Add New Project"**
2. Select **"Import Git Repository"**
3. Choose your repository
4. Click **"Import"**

### 2.3 Configure Frontend
1. **Framework Preset**: Create React App
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `build` (auto-detected)

### 2.4 Set Environment Variable
Add:
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```
*(Use your Railway backend URL from Step 1.6)*

### 2.5 Deploy
- Click **"Deploy"**
- Wait for build to complete
- Get your frontend URL: `https://your-app.vercel.app`

---

## 🔗 Step 3: Connect Frontend & Backend

### 3.1 Update CORS
1. Go back to Railway backend
2. **Variables** tab
3. Update `CORS_ORIGIN` to your Vercel frontend URL:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```
4. Railway auto-redeploys

### 3.2 Initialize Database
1. Railway → Backend service → **Deploy Logs**
2. Click **"Open Shell"**
3. Run:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

---

## ✅ Step 4: Test Your Deployment

### Test Backend
```bash
# Health check
curl https://your-backend.railway.app/health

# Should return: {"status":"ok","timestamp":"..."}
```

### Test Frontend
1. Open: `https://your-app.vercel.app`
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`

### Test API Docs
- Open: `https://your-backend.railway.app/api-docs`

---

## 🔐 Step 5: Security (IMPORTANT!)

### Change Default Passwords

**Option 1: Via API**
```bash
# Register new admin user
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@yourdomain.com",
    "password": "strong-password-here",
    "name": "Admin",
    "role": "ADMIN"
  }'
```

**Option 2: Via Database**
- Use Railway PostgreSQL shell
- Update passwords directly

### Generate Strong Secrets
```bash
# Run this script
./scripts/generate-secrets.sh
```

---

## 📊 Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app/api`
- **API Docs**: `https://your-backend.railway.app/api-docs`
- **Health Check**: `https://your-backend.railway.app/health`

---

## 🎯 Next Steps

1. **Custom Domain** (Optional)
   - Add domain in Vercel settings
   - Add domain in Railway settings
   - Update CORS_ORIGIN

2. **Monitoring**
   - Set up Sentry for error tracking
   - Use Railway/Vercel built-in monitoring
   - Set up UptimeRobot for uptime monitoring

3. **Backups**
   - Railway PostgreSQL has automatic backups
   - Configure backup retention

4. **SSL/HTTPS**
   - Automatically handled by Railway & Vercel
   - Free SSL certificates included

---

## 🆘 Troubleshooting

### Backend not starting?
- Check Railway logs
- Verify DATABASE_URL is set
- Check environment variables

### Frontend can't connect?
- Verify REACT_APP_API_URL is correct
- Check CORS_ORIGIN matches frontend URL
- Check browser console for errors

### Database errors?
- Run migrations: `npx prisma migrate deploy`
- Check DATABASE_URL format
- Verify PostgreSQL is running

### Login not working?
- Verify database is seeded: `npm run seed`
- Check backend logs for errors
- Verify JWT_SECRET is set

---

## 📚 Additional Resources

- **Full Guide**: See `DEPLOYMENT_GUIDE.md`
- **Checklist**: See `PRODUCTION_CHECKLIST.md`
- **Heroku**: See `scripts/deploy-heroku.sh`
- **AWS**: See `DEPLOYMENT_GUIDE.md` (AWS section)

---

## 🎉 Success!

Your Workflow Configuration Platform is now live and accessible to the public!

**Remember**: Change default passwords immediately after deployment!
