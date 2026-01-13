#!/bin/bash

# Script to push code to your GitHub repository
# Repository: git@github.com:PunugupatiSaikumar/Workflow-Configuration-Platform-for-Client-Operations.git

set -e

echo "🚀 Pushing to GitHub Repository..."
echo "Repository: Workflow-Configuration-Platform-for-Client-Operations"
echo ""

cd "$(dirname "$0")"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Set remote
echo "📡 Setting up remote..."
git remote remove origin 2>/dev/null || true
git remote add origin git@github.com:PunugupatiSaikumar/Workflow-Configuration-Platform-for-Client-Operations.git
echo "✅ Remote configured"

# Stage all files
echo ""
echo "📝 Staging files..."
git add .

# Check if there are changes
if git diff --staged --quiet && git rev-parse --verify HEAD >/dev/null 2>&1; then
    echo "ℹ️  No changes to commit"
else
    # Create commit
    echo "💾 Creating commit..."
    git commit -m "Initial commit: Workflow Configuration Platform for Client Operations" || \
    git commit -m "Update: Workflow Configuration Platform"
    echo "✅ Commit created"
fi

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
echo "Branch: main"
echo ""

# Set branch to main
git branch -M main

# Push
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "Repository URL:"
echo "https://github.com/PunugupatiSaikumar/Workflow-Configuration-Platform-for-Client-Operations"
echo ""
echo "Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Follow DEPLOY_STEPS.md for deployment instructions"
echo "3. Use Railway + Vercel for deployment (NOT Streamlit)"
