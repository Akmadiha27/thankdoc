# Quick Deployment Guide - Fix Google Login & Razorpay

## 🎯 The Core Issue
Your `.env` file works locally but **NOT in production** because:
- Vite bakes environment variables during BUILD, not runtime
- You must set them in your hosting platform dashboard
- You must REBUILD/REDEPLOY after setting them

## ⚡ Quick Fix (5 Steps)

### 1️⃣ Set Environment Variables in Hosting Platform

**If using Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add these 3 variables:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_RAZORPAY_KEY_ID
   ```
3. Copy values from your local `.env` file
4. Click "Save"
5. **Trigger a new deployment** (required!)

**If using Netlify:**
1. Site settings → Build & deploy → Environment
2. Add same 3 variables
3. Trigger redeploy

### 2️⃣ Update Supabase URLs (Critical for Google Login!)

Go to: https://supabase.com/dashboard → Your Project → Authentication → URL Configuration

**Site URL:** (Change this!)
```
https://your-actual-deployed-site.vercel.app
```

**Redirect URLs:** (Add your production domain)
```
https://your-actual-deployed-site.vercel.app
https://your-actual-deployed-site.vercel.app/
https://your-actual-deployed-site.vercel.app/auth/callback
https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback
http://localhost:5173
```

### 3️⃣ Update Google OAuth (If using Google login)

Go to: https://console.cloud.google.com → APIs & Services → Credentials

Click your OAuth Client → Add to **Authorized redirect URIs:**
```
https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback
https://your-actual-deployed-site.vercel.app/auth/callback
```

### 4️⃣ Verify Supabase Google Provider

In Supabase Dashboard → Authentication → Providers:
1. Enable Google
2. Add your Google Client ID and Secret
3. Save

### 5️⃣ Test on Production

1. Open your deployed site in incognito/private mode
2. Try Google login - should redirect to production, not localhost
3. Check browser console:
   - Should show `[Razorpay Config] Razorpay key loaded from: env`
   - Should NOT show "Using fallback test key"

## 🔴 Critical Points

### For Environment Variables:
- ✅ Must have `VITE_` prefix
- ✅ Must be set in hosting platform dashboard
- ✅ Must rebuild/redeploy after adding them
- ❌ `.env` file alone doesn't work in production

### For Google Login:
- ✅ Update Supabase Site URL to production domain
- ✅ Add production domain to Redirect URLs
- ✅ Update Google OAuth redirect URIs
- ❌ Don't use `localhost` in production URLs

### For Razorpay:
- ✅ Verify key is set in hosting platform
- ✅ Check console shows "loaded from: env"
- ✅ Test payment flow on production
- ❌ Fallback key should only show in dev

## 🧪 Testing Checklist

After deployment, test:
- [ ] Google login works without localhost error
- [ ] Razorpay modal opens
- [ ] Console shows env key loaded (not fallback)
- [ ] Payment completes successfully
- [ ] Booking is created in database

## 🆘 Still Not Working?

### Google Login Issue:
**Error: "localhost refused to connect"**
→ You haven't updated Supabase Site URL to production domain

### Razorpay Issue:
**Console shows: "Using fallback test key"**
→ Environment variable not set in hosting platform, or you haven't redeployed

### Both Issues:
1. Double-check all environment variables are set
2. **Trigger a FULL redeploy** (not just restart)
3. Clear browser cache completely
4. Test in private/incognito window
5. Wait 5-10 minutes for DNS/OAuth changes

## 📱 What Your Production URLs Should Look Like

Replace `your-site.vercel.app` with YOUR actual domain:

**Supabase Dashboard:**
```
Site URL: https://your-site.vercel.app
Redirect: https://your-site.vercel.app/auth/callback
```

**Google Cloud Console:**
```
Redirect URI: https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback
Redirect URI: https://your-site.vercel.app/auth/callback
```

**Vercel Environment Variables:**
```
VITE_SUPABASE_URL=https://dkjkuxbadylsquvrclnk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi... (your key)
VITE_RAZORPAY_KEY_ID=rzp_test_... (your key)
```

## ⏱️ Timeline

- Setting env vars: 2 minutes
- Rebuilding/deploying: 3-5 minutes
- Google OAuth propagation: 5-10 minutes
- **Total: ~15 minutes** for everything to work

## 🎯 Success Message

When everything is correct, you'll see:
- ✅ Google login redirects to your production site
- ✅ No "localhost" errors
- ✅ Razorpay loads with your actual key
- ✅ Console: `[Razorpay Config] Razorpay key loaded from: env`
- ✅ Payments work end-to-end

**Remember: The key is REBUILDING after setting environment variables!**
