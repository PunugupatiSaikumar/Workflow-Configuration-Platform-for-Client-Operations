# 🚀 Deployment Guide - Public Production Deployment

This guide covers deploying the Workflow Configuration Platform for public use.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Option 1: Docker Deployment (Recommended)](#option-1-docker-deployment)
3. [Option 2: Heroku Deployment](#option-2-heroku-deployment)
4. [Option 3: AWS Deployment](#option-3-aws-deployment)
5. [Option 4: Vercel + Railway](#option-4-vercel--railway)
6. [Post-Deployment Steps](#post-deployment-steps)

## Pre-Deployment Checklist

### Security Updates Required:

- [ ] Change default admin password
- [ ] Change default user password
- [ ] Set strong JWT_SECRET (minimum 32 characters)
- [ ] Update CORS_ORIGIN to your production domain
- [ ] Use production database (not local)
- [ ] Enable HTTPS/SSL
- [ ] Set up environment variables securely
- [ ] Review and update API rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backups

## Option 1: Docker Deployment (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

### Steps

1. **Clone repository**
   ```bash
   git clone <your-repo-url>
   cd "Workflow Configuration Platform for Client Operations"
   ```

2. **Set environment variables**
   ```bash
   # Backend .env
   cd backend
   cp .env.example .env
   # Edit .env with production values
   ```

   Required variables:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   PORT=5001
   NODE_ENV=production
   JWT_SECRET=your-very-strong-secret-key-minimum-32-characters
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

3. **Update docker-compose.yml for production**
   ```bash
   # Edit docker-compose.yml
   # Update CORS_ORIGIN
   # Update environment variables
   ```

4. **Build and start**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

5. **Run migrations**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   docker-compose exec backend npm run seed
   ```

6. **Set up reverse proxy (nginx)**
   See `nginx.conf.example` for configuration

## Option 2: Heroku Deployment

### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-very-strong-secret-key
   heroku config:set JWT_EXPIRES_IN=7d
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
   ```

6. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

7. **Run migrations**
   ```bash
   heroku run npx prisma migrate deploy
   heroku run npm run seed
   ```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variables**
   ```bash
   vercel env add REACT_APP_API_URL
   # Enter: https://your-backend.herokuapp.com/api
   ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

## Option 3: AWS Deployment

### Using AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize**
   ```bash
   cd backend
   eb init
   # Select region, platform (Node.js), application name
   ```

3. **Create environment**
   ```bash
   eb create production-env
   ```

4. **Set environment variables**
   ```bash
   eb setenv NODE_ENV=production JWT_SECRET=your-secret CORS_ORIGIN=https://your-domain.com
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

### Using AWS ECS (Docker)

1. **Build and push Docker image**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

   # Build
   docker build -t workflow-backend ./backend

   # Tag
   docker tag workflow-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/workflow-backend:latest

   # Push
   docker push <account>.dkr.ecr.us-east-1.amazonaws.com/workflow-backend:latest
   ```

2. **Create ECS cluster and service**
   - Use AWS Console or Terraform
   - Configure load balancer
   - Set up RDS PostgreSQL instance

## Option 4: Vercel + Railway

### Backend on Railway

1. **Sign up at railway.app**

2. **Create new project**
   - Connect GitHub repository
   - Select backend folder

3. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"

4. **Set environment variables**
   - DATABASE_URL (auto-set by Railway)
   - JWT_SECRET
   - NODE_ENV=production
   - CORS_ORIGIN

5. **Deploy**
   - Railway auto-deploys on git push

### Frontend on Vercel

1. **Sign up at vercel.com**

2. **Import project**
   - Connect GitHub repository
   - Select frontend folder

3. **Set environment variables**
   - REACT_APP_API_URL=https://your-backend.railway.app/api

4. **Deploy**
   - Vercel auto-deploys

## Post-Deployment Steps

### 1. Verify Deployment

```bash
# Test backend health
curl https://your-backend-domain.com/health

# Test API
curl https://your-backend-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### 2. Update Default Credentials

**IMPORTANT**: Change default passwords immediately!

```bash
# Via API or database
# Update admin@example.com password
# Update user@example.com password
```

### 3. Set Up Monitoring

- **Application Monitoring**: New Relic, Datadog, or Sentry
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry

### 4. Configure Backups

- **Database**: Automated daily backups
- **File Storage**: S3 or similar
- **Backup Retention**: 30 days minimum

### 5. Set Up SSL/HTTPS

- **Let's Encrypt**: Free SSL certificates
- **Cloudflare**: Free SSL + CDN
- **AWS Certificate Manager**: For AWS deployments

### 6. Performance Optimization

- Enable CDN for frontend assets
- Set up caching headers
- Enable database connection pooling
- Configure rate limiting

## Quick Deploy Scripts

See `scripts/` directory for automated deployment scripts.

## Support

For deployment issues, check:
- Application logs
- Database connection
- Environment variables
- CORS configuration
- SSL certificates
