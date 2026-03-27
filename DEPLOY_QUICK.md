# Quick Deploy Reference

## TL;DR - Get Live in 5 Minutes

### 1. Install Git
https://git-scm.com/download/win

### 2. Push to GitHub
```powershell
cd c:\Users\My PC\.vscode\extensions\delivery-tracker

git config --global user.name "Your Name"
git config --global user.email "you@email.com"
git init
git add .
git commit -m "deployment"
git remote add origin https://github.com/YOU/delivery-tracker.git
git branch -M main
git push -u origin main
```

### 3. Deploy (Pick ONE)

**RAILWAY (Easiest):**
```
1. Go to railway.app
2. Login with GitHub
3. Create → Deploy from GitHub → Select repo
4. Done! Public URL auto-generated ✨
```

**RENDER:**
```
1. Go to render.com
2. Login with GitHub  
3. New Web Service → Select repo
4. Build: npm run install-all && npm run build
5. Start: npm --prefix backend start
6. Deploy!
```

**HEROKU:**
```powershell
choco install heroku-cli
heroku login
heroku create my-tracker
git push heroku main
heroku open
```

**DOCKER HUB:**
```powershell
docker login
docker build -t username/delivery-tracker .
docker push username/delivery-tracker
# Others run: docker run -p 4000:4000 username/delivery-tracker
```

---

## Test Live App

```bash
curl https://YOUR-APP-URL/api/health
# Should return: {"status":"ok",...}
```

---

## Share

Copy your platform URL and send to team:
- Railway: `https://delivery-tracker-production-xxx.railway.app`
- Render: `https://delivery-tracker.onrender.com`
- Heroku: `https://my-tracker.herokuapp.com`

---

Full setup guide: See `SETUP_GITHUB.md`
