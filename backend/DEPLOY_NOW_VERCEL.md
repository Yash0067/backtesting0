# 🚀 Deploy Backend to Vercel - Right Now!

## Quick Deploy (2 minutes)

### Method 1: Using Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import Git Repository: `Yash0067/backtesting0`
   - Click "Import"

3. **Configure Project**
   - **Root Directory**: Set to `backend`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (or `pip install -r requirements.txt`)
   - **Output Directory**: Leave empty
   - **Install Command**: `pip install -r requirements.txt`

4. **Environment Variables**
   Click "Environment Variables" and add:
   
   **Variable 1:**
   - **KEY**: `ALLOWED_ORIGINS` (NOT the URL - just the name!)
   - **VALUE**: `https://frontend-nu-ten-75.vercel.app`
   
   **Variable 2 (Optional):**
   - **KEY**: `PYTHON_VERSION`
   - **VALUE**: `3.11.0`
   
   ⚠️ **IMPORTANT**: The KEY must be a valid variable name (letters, numbers, underscore only). The URL goes in the VALUE field!

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your new URL

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Navigate to backend
cd backend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? Yes
# - Project name: backtesting-api
# - Directory: . (current)

# Deploy to production
vercel --prod
```

### Method 3: Auto-Deploy from GitHub

If your repo is connected to Vercel:
1. Push changes to GitHub
2. Vercel will auto-deploy
3. Check Vercel dashboard for URL

---

## After Deployment

1. **Get your backend URL** from Vercel dashboard
2. **Update frontend**:
   ```bash
   cd frontend
   node auto-update-config.js https://your-new-vercel-url.vercel.app
   git add config.js index.html
   git commit -m "Update backend URL"
   git push origin main
   ```

---

## Verify

1. Test backend: `https://your-url.vercel.app/docs`
2. Test frontend: https://frontend-nu-ten-75.vercel.app
3. Try uploading a file

---

## Troubleshooting

**Build fails?**
- Check Root Directory is `backend`
- Verify `vercel.json` exists
- Check Python version

**App doesn't work?**
- Check Vercel logs
- Verify environment variables
- Test `/docs` endpoint

