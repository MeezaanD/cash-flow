#!/bin/bash

# Firebase Cloud Functions Deployment Script
# This script automates the deployment of Firebase Cloud Functions

set -e  # Exit on any error

echo "🚀 Starting Firebase Cloud Functions deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run:"
    echo "firebase login"
    exit 1
fi

# Navigate to functions directory
cd functions

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building functions..."
npm run build

echo "✅ Build completed successfully!"

# Go back to project root
cd ..

echo "🚀 Deploying functions to Firebase..."
firebase deploy --only functions

echo "✅ Deployment completed successfully!"

echo ""
echo "🎉 Your Firebase Cloud Functions are now deployed!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env file with the function URLs"
echo "2. Test the API endpoints in your React app"
echo "3. Check the Firebase Console for function logs"
echo ""
echo "🔗 Function URLs will be displayed above." 