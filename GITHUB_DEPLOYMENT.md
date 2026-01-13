# 🚀 GitHub Deployment Guide

## Step 1: Push Code to GitHub

### 1.1 Initialize Git Repository (if not already done)

```bash
cd "/Users/punug/Desktop/Projects/Workflow Configuration Platform for Client Operations"
git init
```

### 1.2 Create .gitignore (if not exists)

Make sure `.gitignore` includes:
```
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
coverage/
.vscode/
.idea/
```

### 1.3 Stage All Files

```bash
git add .
```

### 1.4 Create Initial Commit

```bash
git commit -m "Initial commit: Workflow Configuration Platform"
```

### 1.5 Create GitHub Repository

1. Go to https://github.com
2. Click **"New repository"** (or the **+** icon)
3. Repository name: `workflow-configuration-platform` (or your preferred name)
4. Description: "Workflow Configuration Platform for Client Operations"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have files)
7. Click **"Create repository"**

### 1.6 Connect Local Repository to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/workflow-configuration-platform.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/workflow-configuration-platform.git
```

### 1.7 Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## Step 2: Deployment Options (NOT Streamlit)

**Important**: Streamlit is for Python applications. Your project uses:
- **Frontend**: React (JavaScript/TypeScript)
- **Backend**: Node.js/Express
- **Database**: PostgreSQL

### Recommended Deployment Options:

#### Option 1: Railway + Vercel (Easiest & Free) ⭐ RECOMMENDED

**Backend on Railway:**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Set **Root Directory**: `backend`
6. Add PostgreSQL database
7. Set environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-strong-secret>
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

**Frontend on Vercel:**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Add New Project"** → Import your repo
4. Set **Root Directory**: `frontend`
5. Set environment variable:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```

#### Option 2: Heroku (Simple)

**Backend:**
```bash
cd backend
heroku create your-app-name-backend
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set NODE_ENV=production JWT_SECRET=<secret> CORS_ORIGIN=<frontend-url>
git subtree push --prefix backend heroku main
```

**Frontend:**
- Use Vercel or Netlify (free)

#### Option 3: AWS (Advanced)

- Use AWS Elastic Beanstalk for backend
- Use AWS Amplify or S3 + CloudFront for frontend
- Use RDS for PostgreSQL

#### Option 4: DigitalOcean (Self-hosted)

- Use App Platform for backend
- Use App Platform for frontend
- Use Managed PostgreSQL database

## Step 3: Environment Variables Setup

### Backend (.env) - Set in Railway/Heroku/etc:
```env
DATABASE_URL=<provided-by-platform>
PORT=5001
NODE_ENV=production
JWT_SECRET=<generate-strong-secret-minimum-32-chars>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env) - Set in Vercel/etc:
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Step 4: Generate Strong Secrets

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate Database Password (if needed)
openssl rand -base64 24
```

## Step 5: Post-Deployment Steps

1. **Run Database Migrations:**
   ```bash
   # In Railway/Heroku shell:
   npx prisma migrate deploy
   npm run seed
   ```

2. **Update CORS_ORIGIN** in backend to match frontend URL

3. **Test Deployment:**
   - Visit frontend URL
   - Try logging in
   - Test creating a workflow

4. **Change Default Passwords** (IMPORTANT!)

## Quick Commands Summary

```bash
# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main

# For future updates
git add .
git commit -m "Your commit message"
git push origin main
```

## Need Help?

- **GitHub Issues**: Check repository settings
- **Deployment Issues**: Check platform logs
- **Database Issues**: Verify DATABASE_URL is set correctly
