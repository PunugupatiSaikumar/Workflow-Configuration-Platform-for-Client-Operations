#!/bin/bash

# Railway Deployment Script
# Usage: ./scripts/deploy-railway.sh

set -e

echo "🚀 Railway Deployment Guide"
echo ""
echo "Backend Deployment:"
echo "1. Sign up at https://railway.app"
echo "2. Create new project"
echo "3. Connect GitHub repository"
echo "4. Select 'backend' as root directory"
echo "5. Add PostgreSQL database"
echo "6. Set environment variables:"
echo "   - JWT_SECRET=$(openssl rand -base64 32)"
echo "   - NODE_ENV=production"
echo "   - CORS_ORIGIN=https://your-frontend-domain.com"
echo "7. Railway will auto-deploy"
echo ""
echo "Frontend Deployment (Vercel):"
echo "1. Sign up at https://vercel.com"
echo "2. Import GitHub repository"
echo "3. Select 'frontend' as root directory"
echo "4. Set environment variable:"
echo "   - REACT_APP_API_URL=https://your-backend.railway.app/api"
echo "5. Deploy"
