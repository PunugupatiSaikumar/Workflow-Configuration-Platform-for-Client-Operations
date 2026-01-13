#!/bin/bash

# Script to push code to GitHub
# Usage: ./PUSH_TO_GITHUB.sh

set -e

echo "🚀 Preparing to push to GitHub..."
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Navigate to project directory
cd "$(dirname "$0")"

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already initialized"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "⚠️  .gitignore not found. Creating one..."
    cat > .gitignore << EOF
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
EOF
    echo "✅ .gitignore created"
fi

# Stage all files
echo ""
echo "📝 Staging files..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Create commit
    echo "💾 Creating commit..."
    read -p "Enter commit message (or press Enter for default): " COMMIT_MSG
    COMMIT_MSG=${COMMIT_MSG:-"Initial commit: Workflow Configuration Platform"}
    git commit -m "$COMMIT_MSG"
    echo "✅ Commit created"
fi

# Check if remote exists
if git remote | grep -q "^origin$"; then
    echo ""
    echo "✅ Remote 'origin' already exists"
    echo "Current remote URL:"
    git remote get-url origin
    echo ""
    read -p "Do you want to change the remote URL? (y/n): " CHANGE_REMOTE
    if [ "$CHANGE_REMOTE" = "y" ]; then
        read -p "Enter new GitHub repository URL: " NEW_URL
        git remote set-url origin "$NEW_URL"
        echo "✅ Remote URL updated"
    fi
else
    echo ""
    echo "📡 Setting up GitHub remote..."
    read -p "Enter your GitHub username: " GITHUB_USER
    read -p "Enter your repository name: " REPO_NAME
    GITHUB_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"
    
    echo ""
    echo "Adding remote: $GITHUB_URL"
    git remote add origin "$GITHUB_URL"
    echo "✅ Remote added"
fi

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
read -p "Press Enter to push to main branch (or Ctrl+C to cancel)..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Follow DEPLOY_STEPS.md for deployment instructions"
echo ""
echo "⚠️  IMPORTANT: Streamlit is NOT suitable for this project!"
echo "   Your app uses React + Node.js + PostgreSQL"
echo "   Use Railway + Vercel instead (see DEPLOY_STEPS.md)"
