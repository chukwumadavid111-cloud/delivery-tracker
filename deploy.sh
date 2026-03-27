#!/bin/bash

# Cloud Deployment Automation Script
# This script automates the deployment workflow

set -e

echo "🚀 Delivery Tracker - Cloud Deployment Automation"
echo "=================================================="

# Check prerequisites
check_git() {
  if ! command -v git &> /dev/null; then
    echo "❌ Git not installed. Download from: https://git-scm.com/download/win"
    exit 1
  fi
  echo "✅ Git found"
}

# Initialize git
init_git() {
  echo "📁 Initializing git..."
  git config --global user.name "${GIT_USER:-Delivery Tracker}"
  git config --global user.email "${GIT_EMAIL:-dev@delivery-tracker.local}"
  git init
  git add .
  git commit -m "Initial delivery tracker deployment" || echo "Already committed"
}

# Add remote
set_remote() {
  local repo_url=$1
  echo "🔗 Adding remote: $repo_url"
  git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"
  git branch -M main
}

# Push to GitHub
push_to_github() {
  echo "⬆️  Pushing to GitHub..."
  git push -u origin main
}

# Display deployment options
show_options() {
  echo ""
  echo "✨ Your code is now on GitHub!"
  echo ""
  echo "Deploy to: (Choose ONE)"
  echo "  1. Railway.app   → railway.app (auto-deploy from GitHub)"
  echo "  2. Render        → render.com (free tier)"
  echo "  3. Heroku        → heroku.com (via CLI)"
  echo "  4. DigitalOcean  → digitalocean.com (affordable)"
  echo "  5. Docker Hub    → hub.docker.com (self-hosted)"
  echo ""
  echo "See SETUP_GITHUB.md for detailed steps"
}

# Main
main() {
  check_git
  
  if [ ! -d ".git" ]; then
    init_git
  fi
  
  if [ -n "$1" ]; then
    set_remote "$1"
    push_to_github
  fi
  
  show_options
}

main "$@"
