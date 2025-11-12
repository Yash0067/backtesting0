# Deploying to Render

This guide will help you deploy the Backtesting API backend to Render.

## Prerequisites

1. A [Render](https://render.com) account (free tier available)
2. A MongoDB database (you can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
3. Your GitHub repository connected to Render

## Step 1: Prepare MongoDB (Optional but Recommended)

1. Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
2. Create a cluster
3. Create a database user
4. Whitelist Render's IP addresses (or use `0.0.0.0/0` for all IPs in development)
5. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## Step 2: Deploy to Render

### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**
   - Visit [https://dashboard.render.com](https://dashboard.render.com)
   - Sign in or create an account

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (`Yash0067/backtesting0`)
   - Select the repository

3. **Configure the Service**
   - **Name**: `backtesting-api` (or any name you prefer)
   - **Environment**: `Python 3`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend` (IMPORTANT: Set this to `backend`)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.backend.app:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables**
   Click on "Environment" tab and add:
   - `PYTHON_VERSION`: `3.11.0`
   - `PORT`: (Auto-set by Render, don't change)
   - `DATABASE_URL`: `sqlite:///./backtests.db` (or your PostgreSQL URL if using)
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/`)
   - `MONGODB_DB`: `trading_strategy_db`
   - `DATA_DIR`: Leave empty (will use default)

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your application
   - Wait for the build to complete (usually 2-5 minutes)

### Option B: Using render.yaml (Alternative)

If you prefer using the `render.yaml` file:

1. Make sure `render.yaml` is in your repository root (not in backend/)
2. In Render dashboard:
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect and use `render.yaml`

## Step 3: Verify Deployment

1. Once deployed, Render will provide you with a URL like: `https://backtesting-api.onrender.com`
2. Test the API:
   - Visit `https://your-app-name.onrender.com/docs` to see the API documentation
   - Or test with: `curl https://your-app-name.onrender.com/backtests`

## Step 4: Update Frontend (If Needed)

Update your frontend API base URL to point to your Render deployment:

```javascript
// In frontend/script.js
const API_BASE = 'https://your-app-name.onrender.com';

// In frontend/history.js
const API_BASE_URL = 'https://your-app-name.onrender.com/api';
```

## Important Notes

### File Storage
- Files uploaded to Render are stored in ephemeral storage
- Files will be lost when the service restarts
- For production, consider using:
  - AWS S3
  - Google Cloud Storage
  - Render Disk (paid feature)

### Database
- SQLite files are also ephemeral on Render
- For production, use:
  - PostgreSQL (Render offers managed PostgreSQL)
  - MongoDB Atlas (recommended for this app)

### Free Tier Limitations
- Render free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading for production use

### CORS
- The app currently allows all origins (`allow_origins=["*"]`)
- For production, update CORS in `backend/src/backend/app.py` to only allow your frontend domain

## Troubleshooting

### Build Fails
- Check that `Root Directory` is set to `backend`
- Verify `requirements.txt` is in the backend directory
- Check build logs for specific errors

### Application Crashes
- Check logs in Render dashboard
- Verify environment variables are set correctly
- Ensure MongoDB connection string is correct

### Port Issues
- Render automatically sets `$PORT` environment variable
- Make sure your start command uses `$PORT`, not a hardcoded port

### Database Issues
- SQLite may have issues with concurrent writes
- Consider using PostgreSQL for production
- MongoDB Atlas is recommended for this application

## Updating Your Deployment

1. Push changes to your GitHub repository
2. Render will automatically detect and deploy the changes
3. You can also manually trigger a deploy from the Render dashboard

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- Check your application logs in the Render dashboard for specific errors

