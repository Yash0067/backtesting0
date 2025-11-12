# 🚀 Step-by-Step Backend Deployment Guide

## Choose Your Platform

You have two options:
1. **Render** (Recommended for Python/FastAPI) - Free tier available
2. **Vercel** (You already have a Vercel URL, so might be using this)

---

## Option 1: Deploy to Render (Recommended)

### Step 1: Go to Render Dashboard
1. Visit: https://dashboard.render.com
2. Sign in (or create free account)

### Step 2: Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. If prompted, connect your GitHub account
4. Select repository: **`Yash0067/backtesting0`**

### Step 3: Configure Service
Fill in these **EXACT** values:

```
Name: backtesting-api
Environment: Python 3
Region: (Choose closest to you)
Branch: main
Root Directory: backend
```

### Step 4: Build & Start Commands
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn src.backend.app:app --host 0.0.0.0 --port $PORT
```

### Step 5: Environment Variables
Click **"Environment"** tab, then add:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `DATABASE_URL` | `sqlite:///./backtests.db` |
| `ALLOWED_ORIGINS` | `https://frontend-nu-ten-75.vercel.app` |

(Optional - if using MongoDB):
| `MONGODB_URI` | Your MongoDB connection string |
| `MONGODB_DB` | `trading_strategy_db` |

### Step 6: Deploy
1. Scroll down
2. Click **"Create Web Service"**
3. Wait 3-5 minutes
4. Copy your URL (e.g., `https://backtesting-api.onrender.com`)

### Step 7: Update Frontend
Once you have the Render URL, update frontend:
```bash
cd frontend
node auto-update-config.js https://your-render-url.onrender.com
git add config.js index.html
git commit -m "Update to Render backend"
git push origin main
```

---

## Option 2: Deploy to Vercel (If using Vercel)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Navigate to Backend
```bash
cd backend
```

### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- Link to existing project? **Yes** (if you have one)
- Project name: `backtesting-api`
- Directory: `.` (current directory)
- Override settings? **No**

### Step 4: Set Environment Variables
In Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add:
   - `PYTHON_VERSION` = `3.11.0`
   - `DATABASE_URL` = `sqlite:///./backtests.db`
   - `ALLOWED_ORIGINS` = `https://frontend-nu-ten-75.vercel.app`

### Step 5: Create vercel.json
Create `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/backend/app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/backend/app.py"
    }
  ]
}
```

### Step 6: Redeploy
```bash
vercel --prod
```

---

## Quick Deploy Script

I've created a helper script. Run:

```bash
cd backend
# For Render
./deploy-to-render.sh

# Or for Vercel
./deploy-to-vercel.sh
```

---

## Verify Deployment

1. Test your backend:
   - Visit: `https://your-backend-url.onrender.com/docs`
   - Or: `https://your-backend-url.vercel.app/docs`
   - You should see FastAPI documentation

2. Test from frontend:
   - Visit: https://frontend-nu-ten-75.vercel.app
   - Try uploading a file
   - Check browser console (F12) for errors

---

## Troubleshooting

### Build Fails?
- ✅ Check Root Directory is `backend` (Render)
- ✅ Verify `requirements.txt` exists
- ✅ Check Python version matches

### App Crashes?
- ✅ Check logs in dashboard
- ✅ Verify environment variables
- ✅ Check start command uses `$PORT`

### CORS Errors?
- ✅ Backend CORS already configured
- ✅ Verify `ALLOWED_ORIGINS` includes frontend URL

---

## Need Help?

Check the logs in your deployment platform's dashboard for specific errors.

