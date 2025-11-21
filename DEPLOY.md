# 🚀 Deploy KosovaHike - Step by Step Guide

## 📍 Overview

Your project needs **2 deployments**:
1. **Backend** → Render or Railway (FREE)
2. **Frontend** → Netlify (FREE) ✅
3. **Database** → MongoDB Atlas (FREE)

---

## 🎯 Step 1: MongoDB Atlas Setup (5 minutes)

### 1. Create MongoDB Atlas Account
- Go to: https://www.mongodb.com/cloud/atlas/register
- Sign up (FREE tier available)

### 2. Create Cluster
- Click "Build a Database"
- Choose **FREE** (M0) tier
- Select a region
- Click "Create Cluster" (takes 3-5 minutes)

### 3. Create Database User
- Go to "Database Access" → "Add New Database User"
- Username: `kosovahike`
- Password: **Create strong password** (save it!)
- Database User Privileges: "Atlas Admin"
- Click "Add User"

### 4. Configure Network Access
- Go to "Network Access" → "Add IP Address"
- Click **"Allow Access from Anywhere"** (for now)
- Click "Confirm"

### 5. Get Connection String
- Go to "Database" → "Connect"
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your database user password
- **Save this!** You'll need it:
  ```
  mongodb+srv://kosovahike:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kosovahike?retryWrites=true&w=majority
  ```

---

## ⚙️ Step 2: Deploy Backend (Render - FREE)

### Why Render?
- ✅ FREE tier available
- ✅ Easy setup
- ✅ Auto-deploys from GitHub
- ✅ Perfect for Node.js APIs

### Setup:

1. **Sign up:** https://render.com
   - Use GitHub to sign up (easiest)

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not connected
   - Find your `kosovahike` repository
   - Click "Connect"

3. **Configure Service:**
   ```
   Name: kosovahike-backend
   Region: Choose closest to you
   Branch: main (or master)
   Root Directory: hiking-backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

4. **Environment Variables:**
   Click "Advanced" → "Add Environment Variable" for each:
   ```
   MONGO_URI = mongodb+srv://kosovahike:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kosovahike
   APP_SECRET = your_super_secret_key_minimum_32_characters_long
   NODE_ENV = production
   PORT = 10000
   FRONTEND_URL = https://your-app-name.netlify.app (update after frontend deployment)
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait 5-10 minutes for first deployment
   - **Copy your backend URL** (e.g., `https://kosovahike-backend.onrender.com`)
   - ⚠️ First request might be slow (cold start on free tier)

---

## 🌐 Step 3: Deploy Frontend (Netlify - FREE)

### Why Netlify?
- ✅ FREE tier
- ✅ Perfect for React apps
- ✅ Automatic HTTPS
- ✅ Fast CDN
- ✅ Easy environment variables

### Setup:

1. **Sign up:** https://app.netlify.com
   - Use GitHub to sign up

2. **Add New Site:**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your `kosovahike` repository

3. **Build Settings:**
   ```
   Base directory: hiking-frontend/hiking-app
   Build command: npm install && npm run build
   Publish directory: hiking-frontend/hiking-app/build
   ```

4. **Environment Variables:**
   - Click "Show advanced" → "New variable"
   - Add:
   ```
   REACT_APP_API_URL = https://your-backend-name.onrender.com
   NODE_ENV = production
   ```
   ⚠️ **Important:** Replace `your-backend-name` with your actual Render backend URL!

5. **Deploy:**
   - Click "Deploy site"
   - Wait 3-5 minutes for build
   - **Copy your site URL** (e.g., `https://kosovahike.netlify.app`)

6. **Update Backend CORS:**
   - Go back to Render dashboard
   - Go to your backend service → Environment
   - Update `FRONTEND_URL` with your Netlify URL:
     ```
     FRONTEND_URL = https://kosovahike.netlify.app
     ```
   - Click "Save Changes" (auto-redeploys)

---

## ✅ Step 4: Test Your Deployment

1. **Test Backend:**
   - Visit: `https://your-backend.onrender.com`
   - Should see: `{"message":"KosovaHike API","version":"1.0.0","status":"running"}`

2. **Test Frontend:**
   - Visit: `https://your-app.netlify.app`
   - Should load without errors
   - Open browser console (F12)
   - Check for any API errors

3. **Test Login:**
   - Try creating an account
   - Try logging in
   - Check if data loads correctly

---

## 🔧 Troubleshooting

### ❌ "Cannot connect to database"
**Fix:**
- Verify `MONGO_URI` is correct in Render
- Check MongoDB Network Access allows connections
- Make sure password in connection string is correct

### ❌ "CORS error" in browser console
**Fix:**
- Update `FRONTEND_URL` in Render backend settings
- Make sure it matches your Netlify URL exactly
- Redeploy backend

### ❌ "Network Error" or "Failed to fetch"
**Fix:**
- Check `REACT_APP_API_URL` in Netlify is correct
- Make sure backend is running (visit backend URL)
- Check browser console for specific errors

### ❌ Backend shows "Application Error"
**Fix:**
- Check Render logs for errors
- Verify all environment variables are set
- Check MongoDB connection string is valid

---

## 📝 Quick Reference

### Your URLs (After Deployment)
- **Frontend:** `https://your-app-name.netlify.app`
- **Backend:** `https://your-backend-name.onrender.com`
- **Database:** MongoDB Atlas (cloud)

### Environment Variables

**Backend (Render):**
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/kosovahike
APP_SECRET=your_secret_key_32_chars_minimum
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-app.netlify.app
```

**Frontend (Netlify):**
```
REACT_APP_API_URL=https://your-backend.onrender.com
NODE_ENV=production
```

---

## 🎉 Success!

Once deployed:
1. ✅ Your app is live!
2. ✅ Share the links in your portfolio
3. ✅ Update README.md with live URLs
4. ✅ Add screenshots to portfolio

---

## 💡 Pro Tips

1. **Custom Domain:** Netlify allows free custom domains (you can add later)
2. **Auto-Deploy:** Both platforms auto-deploy on git push
3. **Logs:** Check deployment logs if something goes wrong
4. **Free Tier Limits:**
   - Render: 750 hours/month (enough for portfolio)
   - Netlify: 100GB bandwidth/month (plenty for portfolio)
   - MongoDB Atlas: 512MB storage (good for testing)

---

**Need help? Check the logs in Render/Netlify dashboards!** 🚀
