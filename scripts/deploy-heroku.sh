#!/bin/bash

# Heroku Deployment Script
# Usage: ./scripts/deploy-heroku.sh

set -e

echo "🚀 Deploying to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Install from https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Backend deployment
echo "📦 Deploying backend..."
cd backend

# Check if Heroku app exists
if ! heroku apps:info &> /dev/null; then
    echo "Creating new Heroku app..."
    read -p "Enter backend app name: " BACKEND_APP
    heroku create $BACKEND_APP
else
    BACKEND_APP=$(heroku apps:info | grep "Name:" | awk '{print $2}')
    echo "Using existing app: $BACKEND_APP"
fi

# Add PostgreSQL if not exists
if ! heroku addons:info postgresql &> /dev/null; then
    echo "Adding PostgreSQL addon..."
    heroku addons:create heroku-postgresql:hobby-dev
fi

# Set environment variables
echo "Setting environment variables..."
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set JWT_EXPIRES_IN=7d

read -p "Enter frontend URL (e.g., https://your-app.vercel.app): " FRONTEND_URL
heroku config:set CORS_ORIGIN=$FRONTEND_URL

# Deploy
echo "Deploying backend..."
git subtree push --prefix backend heroku main

# Run migrations
echo "Running database migrations..."
heroku run npx prisma migrate deploy
heroku run npm run seed

echo "✅ Backend deployed!"
echo "Backend URL: https://$BACKEND_APP.herokuapp.com"

cd ..

# Frontend deployment instructions
echo ""
echo "📱 Frontend Deployment:"
echo "1. Install Vercel CLI: npm install -g vercel"
echo "2. cd frontend"
echo "3. vercel"
echo "4. Set REACT_APP_API_URL=https://$BACKEND_APP.herokuapp.com/api"
echo "5. vercel --prod"
