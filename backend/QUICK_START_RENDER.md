# Quick Start: Deploy to Render

## 🚀 Fast Deployment Steps

### 1. Connect Repository to Render
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select repository: `Yash0067/backtesting0`

### 2. Configure Service
- **Name**: `backtesting-api`
- **Root Directory**: `backend` ⚠️ **IMPORTANT**
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn src.backend.app:app --host 0.0.0.0 --port $PORT`

### 3. Set Environment Variables
Add these in the "Environment" tab:

```
PYTHON_VERSION=3.11.0
DATABASE_URL=sqlite:///./backtests.db
MONGODB_URI=your_mongodb_connection_string_here
MONGODB_DB=trading_strategy_db
```

### 4. Deploy!
Click "Create Web Service" and wait ~3-5 minutes.

### 5. Get Your URL
After deployment, you'll get a URL like:
`https://backtesting-api.onrender.com`

Test it: `https://your-app-name.onrender.com/docs`

---

## 📝 MongoDB Setup (Optional)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free)
2. Create a cluster
3. Create database user
4. Get connection string
5. Add to Render environment variables as `MONGODB_URI`

---

## ⚠️ Important Notes

- **Root Directory MUST be `backend`** - This tells Render where your code is
- Files uploaded are temporary (lost on restart)
- Free tier spins down after 15 min inactivity
- First request after spin-down takes 30-60 seconds

---

## 🔧 Troubleshooting

**Build fails?**
- Check Root Directory is set to `backend`
- Verify `requirements.txt` exists in backend/

**App crashes?**
- Check logs in Render dashboard
- Verify environment variables are set
- Check MongoDB connection string

**Port errors?**
- Make sure start command uses `$PORT` (not hardcoded)

---

For detailed instructions, see [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

