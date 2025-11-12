# 🚀 Deploy to Render - Step by Step

## Quick Deploy (5 minutes)

### Step 1: Go to Render
1. Visit: https://dashboard.render.com
2. Sign in (or create free account)

### Step 2: Create Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your GitHub account (if not connected)
4. Select repository: **`Yash0067/backtesting0`**

### Step 3: Configure Service
Fill in these **EXACT** values:

- **Name**: `backtesting-api` (or any name you like)
- **Environment**: `Python 3`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **CRITICAL - Must be `backend`**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn src.backend.app:app --host 0.0.0.0 --port $PORT`

### Step 4: Set Environment Variables
Click **"Environment"** tab, then **"Add Environment Variable"** for each:

1. **PYTHON_VERSION**
   - Key: `PYTHON_VERSION`
   - Value: `3.11.0`

2. **DATABASE_URL** (optional, for SQLite)
   - Key: `DATABASE_URL`
   - Value: `sqlite:///./backtests.db`

3. **MONGODB_URI** (optional, if using MongoDB)
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/`

4. **MONGODB_DB** (optional)
   - Key: `MONGODB_DB`
   - Value: `trading_strategy_db`

5. **ALLOWED_ORIGINS** (for CORS)
   - Key: `ALLOWED_ORIGINS`
   - Value: `https://frontend-nu-ten-75.vercel.app`

### Step 5: Deploy!
1. Scroll down
2. Click **"Create Web Service"**
3. Wait 3-5 minutes for build to complete

### Step 6: Get Your URL
1. Once deployed, you'll see a URL like: `https://backtesting-api.onrender.com`
2. **Copy this URL** - you'll need it!

### Step 7: Test Your Backend
1. Visit: `https://your-app-name.onrender.com/docs`
2. You should see the API documentation
3. If you see it, your backend is working! ✅

### Step 8: Update Frontend
Now update your frontend to use this URL (see next section)

---

## 🔗 Connect Frontend to Backend

After you get your Render URL, update the frontend:

### Quick Update:
1. Open `frontend/config.js`
2. Find: `const DEFAULT_API_URL = 'https://your-backend-url.onrender.com';`
3. Replace `https://your-backend-url.onrender.com` with your actual Render URL
4. Open `frontend/index.html`
5. Find: `<meta name="api-url" content="https://your-backend-url.onrender.com" />`
6. Replace with your Render URL
7. Commit and push:
   ```bash
   cd frontend
   git add config.js index.html
   git commit -m "Connect to Render backend"
   git push origin main
   ```

---

## ✅ Verification Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] Can access `/docs` endpoint
- [ ] Frontend config.js updated
- [ ] Frontend index.html updated
- [ ] Changes pushed to GitHub
- [ ] Vercel auto-deployed frontend
- [ ] Tested connection from frontend

---

## 🆘 Troubleshooting

### Build Fails?
- ✅ Check Root Directory is `backend` (not root)
- ✅ Verify `requirements.txt` exists in backend/
- ✅ Check build logs in Render dashboard

### App Crashes?
- ✅ Check logs in Render dashboard
- ✅ Verify environment variables are set
- ✅ Check MongoDB connection (if using)

### CORS Errors?
- ✅ Backend CORS already configured for Vercel
- ✅ Check `ALLOWED_ORIGINS` environment variable
- ✅ Verify frontend URL matches

### Can't Connect?
- ✅ Test backend directly: `https://your-url.onrender.com/docs`
- ✅ Check backend is not sleeping (free tier spins down)
- ✅ First request after sleep takes 30-60 seconds

---

## 📞 Need Help?

1. Check Render logs: Dashboard → Your Service → Logs
2. Test backend: Visit `/docs` endpoint
3. Check frontend console: F12 → Console tab

