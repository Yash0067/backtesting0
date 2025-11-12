#!/bin/bash
# Script to check if backend is ready for deployment

echo "🔍 Checking Backend Deployment Readiness..."
echo ""

# Check if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "✅ requirements.txt found"
else
    echo "❌ requirements.txt NOT FOUND"
    exit 1
fi

# Check if app.py exists in src/backend
if [ -f "src/backend/app.py" ]; then
    echo "✅ src/backend/app.py found"
else
    echo "❌ src/backend/app.py NOT FOUND"
    exit 1
fi

# Check if Procfile exists
if [ -f "Procfile" ]; then
    echo "✅ Procfile found"
    cat Procfile
else
    echo "⚠️  Procfile not found (optional)"
fi

# Check if render.yaml exists
if [ -f "render.yaml" ]; then
    echo "✅ render.yaml found"
else
    echo "⚠️  render.yaml not found (optional)"
fi

echo ""
echo "✅ Backend is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Create new Web Service"
echo "3. Set Root Directory to: backend"
echo "4. Use Start Command: uvicorn src.backend.app:app --host 0.0.0.0 --port \$PORT"
echo ""

