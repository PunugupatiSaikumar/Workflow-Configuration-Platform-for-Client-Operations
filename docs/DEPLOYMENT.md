# Deployment Guide

This guide covers deployment options for the Workflow Configuration Platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Docker Deployment](#docker-deployment)
- [Heroku Deployment](#heroku-deployment)
- [AWS Deployment](#aws-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment Checklist](#post-deployment-checklist)

## Prerequisites

- Docker and Docker Compose (for Docker deployment)
- Heroku CLI (for Heroku deployment)
- AWS CLI and account (for AWS deployment)
- PostgreSQL database (for non-Docker deployments)

## Docker Deployment

### Local Docker Deployment

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Workflow Configuration Platform for Client Operations"
   ```

2. **Set environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

3. **Build and start services**
   ```bash
   docker-compose up --build
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   docker-compose exec backend npm run seed
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - API Docs: http://localhost:5000/api-docs

### Production Docker Deployment

1. **Update docker-compose.yml** with production settings
2. **Set environment variables** in production
3. **Use a managed PostgreSQL** service (AWS RDS, Heroku Postgres, etc.)
4. **Configure reverse proxy** (nginx, Traefik) for SSL termination
5. **Set up monitoring** and logging

## Heroku Deployment

### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app**
   ```bash
   heroku create workflow-backend
   ```

3. **Add PostgreSQL addon**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev -a workflow-backend
   ```

4. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key -a workflow-backend
   heroku config:set NODE_ENV=production -a workflow-backend
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.com -a workflow-backend
   ```

5. **Deploy backend**
   ```bash
   cd backend
   git subtree push --prefix . heroku main
   ```

6. **Run migrations**
   ```bash
   heroku run npx prisma migrate deploy -a workflow-backend
   heroku run npm run seed -a workflow-backend
   ```

### Frontend Deployment

1. **Create Heroku app**
   ```bash
   heroku create workflow-frontend
   ```

2. **Set buildpacks**
   ```bash
   heroku buildpacks:set heroku/nodejs -a workflow-frontend
   ```

3. **Set environment variables**
   ```bash
   heroku config:set REACT_APP_API_URL=https://workflow-backend.herokuapp.com/api -a workflow-frontend
   ```

4. **Deploy frontend**
   ```bash
   cd frontend
   git subtree push --prefix . heroku main
   ```

## AWS Deployment

### Option 1: AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   cd backend
   eb init
   ```

3. **Create environment**
   ```bash
   eb create workflow-backend-env
   ```

4. **Set environment variables**
   ```bash
   eb setenv JWT_SECRET=your-secret NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

### Option 2: AWS ECS with Docker

1. **Build and push Docker images**
   ```bash
   docker build -t workflow-backend ./backend
   docker tag workflow-backend:latest <account>.dkr.ecr.<region>.amazonaws.com/workflow-backend:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/workflow-backend:latest
   ```

2. **Create ECS cluster and services**
   - Use AWS Console or Terraform
   - Configure load balancer
   - Set up RDS PostgreSQL instance

3. **Configure environment variables** in ECS task definition

### Option 3: AWS EC2

1. **Launch EC2 instance** (Ubuntu 20.04 LTS)
2. **Install Docker and Docker Compose**
3. **Clone repository**
4. **Configure security groups** (ports 80, 443, 5000)
5. **Set up nginx** reverse proxy
6. **Configure SSL** with Let's Encrypt
7. **Set up PM2** or systemd for process management

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@host:5432/database
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env)

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Seed data loaded
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] CORS configured correctly
- [ ] Database backups configured
- [ ] Monitoring and logging set up
- [ ] Default admin credentials changed
- [ ] API documentation accessible
- [ ] Health check endpoints working
- [ ] Frontend can communicate with backend
- [ ] Authentication working
- [ ] All CRUD operations tested

## DNS Configuration

1. **Point domain** to your server/IP
2. **Configure A record** for backend API
3. **Configure A record** for frontend
4. **Set up CNAME** if using CDN

## SSL/TLS Setup

### Using Let's Encrypt (Certbot)

```bash
sudo certbot --nginx -d your-domain.com
```

### Using AWS Certificate Manager

1. Request certificate in ACM
2. Attach to load balancer
3. Configure HTTPS listener

## Monitoring

Recommended tools:
- **Application**: New Relic, Datadog, Sentry
- **Infrastructure**: CloudWatch, Grafana, Prometheus
- **Logs**: CloudWatch Logs, ELK Stack, Papertrail

## Backup Strategy

1. **Database backups**: Daily automated backups
2. **File storage**: S3 or similar object storage
3. **Backup retention**: 30 days minimum
4. **Test restore procedures**: Monthly

## Scaling

- **Horizontal scaling**: Add more instances behind load balancer
- **Database**: Use read replicas for read-heavy workloads
- **Caching**: Implement Redis for session storage and caching
- **CDN**: Use CloudFront or similar for static assets
