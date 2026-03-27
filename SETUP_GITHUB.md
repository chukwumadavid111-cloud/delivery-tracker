# GitHub Setup & Cloud Deployment Guide

## Step 1: Install Git

**Windows:**
- Download from [git-scm.com](https://git-scm.com/download/win)
- Install with defaults
- Restart PowerShell/Terminal

**Verify installation:**
```powershell
git --version
```

---

## Step 2: Initialize Local Git Repository

```powershell
cd c:\Users\My PC\.vscode\extensions\delivery-tracker

# Configure git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize repo
git init

# Add all files
git add .

# First commit
git commit -m "Initial delivery tracker - full stack app"
```

---

## Step 3: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** `delivery-tracker`
3. **Description:** "Full-stack real-time delivery tracking platform"
4. **Visibility:** Public (for free deployment)
5. Click **Create repository**

**Note the URL:** `https://github.com/yourusername/delivery-tracker.git`

---

## Step 4: Push to GitHub

```powershell
cd c:\Users\My PC\.vscode\extensions\delivery-tracker

# Add remote origin (replace with your URL from Step 3)
git remote add origin https://github.com/yourusername/delivery-tracker.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

You'll be prompted to authenticate. Use:
- **Username:** Your GitHub username
- **Password:** Personal Access Token (see below)

### Create GitHub Personal Access Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Name: `git-push`
4. Scopes: Check `repo`, `workflow`
5. Copy token and use as password in git push

---

## Step 5: Deploy to Cloud

### Option A: Railway.app (Recommended - Easiest)

**1. Go to [railway.app](https://railway.app)**

**2. Sign up with GitHub**

**3. Create New Project → Deploy from GitHub**

**4. Select Repository**
- Connect `yourusername/delivery-tracker`

**5. Railway auto-deploys!**
- Detects `railway.json`
- Builds backend + frontend
- Exposes public URL

**6. Get your public URL:**
```
https://delivery-tracker-production-xxxx.railway.app
```

**Share this link!** ✨

---

### Option B: Render.com

**1. Go to [render.com](https://render.com)**

**2. Sign up with GitHub**

**3. Create New → Web Service**

**4. Connect Repository**
- Select `yourusername/delivery-tracker`

**5. Configure:**
- Name: `delivery-tracker`
- Environment: `Node`
- Build Command: `npm run install-all && npm run build`
- Start Command: `npm --prefix backend start`

**6. Deploy!**

---

### Option C: Heroku (Free tier recently removed, but still works)

**1. Install Heroku CLI**

```powershell
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Or use chocolatey:
choco install heroku-cli
```

**2. Login**
```powershell
heroku login
```

**3. Create app**
```powershell
cd c:\Users\My PC\.vscode\extensions\delivery-tracker
heroku create my-delivery-tracker
```

**4. Deploy**
```powershell
# Enable container support
heroku stack:set container

# Push
git push heroku main
```

**5. Open app**
```powershell
heroku open
```

---

### Option D: DigitalOcean App Platform

**1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)**

**2. Create → App**

**3. Select GitHub repo**

**4. Select `Dockerfile` resource type**

**5. DigitalOcean builds & deploys automatically**

**Cost:** ~$5-12/month (affordable)

---

## Step 6: Verify Deployment

Once deployed, test:

```bash
# Health check
curl https://your-app-url/api/health

# Create delivery (via API)
curl -X POST https://your-app-url/api/deliveries \
  -H "Content-Type: application/json" \
  -d '{
    "order_number": "TEST-001",
    "customer_name": "Test User",
    "pickup_address": "Warehouse",
    "dropoff_address": "Destination",
    "driver_name": "Driver",
    "eta": "14:00"
  }'

# View in browser
# https://your-app-url
```

---

## Environment Variables (Production)

If needed, set via platform UI:

| Platform | Where | How |
|----------|-------|-----|
| Railway | Project Settings → Variables | Add via UI |
| Render | Environment | Add via dashboard |
| Heroku | Config Vars | `heroku config:set KEY=VALUE` |
| DigitalOcean | App Spec | Edit spec.yaml |

**Recommended:**
```
NODE_ENV=production
PORT=4000
```

---

## Share Your App

Once deployed:

✅ **Copy public URL from platform**  
✅ **Share on social/email/Slack**

Example:
```
Check out my delivery tracker: https://delivery-tracker-production.railway.app
Test it out with your own orders!
```

---

## Troubleshooting

### Build fails
```
# Check logs on platform dashboard
# Ensure package.json has all deps
npm install --prefix backend --save
npm install --prefix frontend --save
git push
```

### 404 frontend
- Platform should serve `frontend/build/index.html`
- Dockerfile handles this

### Database empty
- First deployment creates fresh `db.sqlite`
- Create test delivery via form or API

### Can't authenticate with GitHub
- Create Personal Access Token (see Step 4)
- Use token as password, not GitHub password

---

## Next Steps

1. ✅ Install Git
2. ✅ Initialize repo (Step 2)
3. ✅ Create GitHub account & repo (Step 3)
4. ✅ Push to GitHub (Step 4)
5. ✅ Pick cloud platform & deploy (Step 5)
6. ✅ Share your live URL!

---

## Support

- **Railway:** [Railway Docs](https://docs.railway.app)
- **Render:** [Render Docs](https://render.com/docs)
- **Heroku:** [Heroku Docs](https://devcenter.heroku.com)
- **Issues:** Check platform logs for errors
