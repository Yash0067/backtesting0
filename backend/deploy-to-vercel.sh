#!/bin/bash
# Helper script for Vercel deployment

echo "🚀 Vercel Deployment Helper"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    echo "Run: npm install -g vercel"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""
echo "Starting deployment..."
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Copy your Vercel backend URL"
echo "2. Update frontend:"
echo "   cd ../frontend"
echo "   node auto-update-config.js https://your-vercel-url.vercel.app"
echo ""

