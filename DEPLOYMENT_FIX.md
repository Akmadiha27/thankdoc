# Deployment Issues Fix - Google Login & Razorpay

## 🚨 Critical Issue: Environment Variables in Production

### The Problem
Your `.env` file works locally, but **Vite environment variables are embedded at BUILD TIME**, not runtime. This means:
- `.env` values are baked into the build during `npm run build`
- Hosting platforms need environment variables set in their dashboard
- Localhost URLs in `.env` cause "localhost refused to connect" after deployment

## ✅ Solution: Proper Deployment Configuration

### Step 1: Set Environment Variables in Your Hosting Platform

Depending on your hosting platform:

#### **Vercel**
1. Go to your project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add these variables:
   ```
   VITE_SUPABASE_URL=https://dkjkuxbadylsquvrclnk.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_actual_razorpay_key_id
   ```
4. **Redeploy** your application

#### **Netlify**
1. Go to **Site settings** > **Build & deploy** > **Environment**
2. Add the same environment variables
3. **Trigger a new deploy**

#### **Other Platforms**
Most hosting platforms have similar environment variable settings in their dashboard.

### Step 2: Fix Google OAuth Redirect URLs

The "localhost refused to connect" error happens because Google OAuth is trying to redirect to localhost instead of your production domain.

#### **In Supabase Dashboard:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** > **URL Configuration**
4. Update these settings:

**Site URL:**
```
https://your-actual-domain.vercel.app
```

**Redirect URLs (add all of these):**
```
https://your-actual-domain.vercel.app
https://your-actual-domain.vercel.app/
https://your-actual-domain.vercel.app/auth/callback
https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback
http://localhost:5173
http://localhost:3000
```

#### **In Google Cloud Console:**
1. Go to https://console.cloud.google.com/
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:
```
https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback
https://your-actual-domain.vercel.app/auth/callback
```

### Step 3: Update Supabase Provider Settings

In Supabase Dashboard:
1. Go to **Authentication** > **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - **Client ID** from Google Cloud Console
   - **Client Secret** from Google Cloud Console
4. Save changes

## 🔧 Fix for Razorpay Not Working in Production

Since you already have `.env` file locally, here's what to check:

### 1. Verify Environment Variables Are Set
After deploying, open browser console on your production site and check:
```javascript
console.log(import.meta.env.VITE_RAZORPAY_KEY_ID);
```

If it shows `undefined`, your hosting platform doesn't have the environment variable set.

### 2. Rebuild After Setting Variables
**Important**: After adding environment variables to your hosting platform:
1. You MUST trigger a new deployment/rebuild
2. Variables are only embedded during build process
3. Simply restarting won't work - you need a full rebuild

### 3. Check Browser Console
When testing payment in production, check console for:
```
[Razorpay Config] Razorpay key loaded from: env
```

If you see "Using fallback test key", the environment variable isn't set properly.

## 📋 Complete Deployment Checklist

### Before Deploying:
- [ ] `.env` file exists with all credentials
- [ ] All credentials are correct and valid
- [ ] Test locally with `npm run dev`

### In Hosting Platform (e.g., Vercel):
- [ ] Set `VITE_SUPABASE_URL`
- [ ] Set `VITE_SUPABASE_ANON_KEY`
- [ ] Set `VITE_RAZORPAY_KEY_ID`
- [ ] Trigger a new deployment

### In Supabase Dashboard:
- [ ] Update Site URL to production domain
- [ ] Add production domain to Redirect URLs
- [ ] Enable Google provider with credentials
- [ ] Verify RLS policies are working

### In Google Cloud Console:
- [ ] Add production redirect URI
- [ ] Add Supabase callback URI
- [ ] OAuth consent screen configured

### After Deployment:
- [ ] Test Google login on production site
- [ ] Check browser console for errors
- [ ] Test Razorpay payment flow
- [ ] Verify bookings are created

## 🐛 Troubleshooting

### Issue: "localhost refused to connect" after Google login
**Cause**: Google is redirecting to localhost instead of production domain
**Fix**: 
1. Update Supabase Site URL to production domain
2. Add production domain to Supabase Redirect URLs
3. Add production redirect URI in Google Cloud Console

### Issue: Razorpay not loading in production
**Cause**: Environment variable not set in hosting platform
**Fix**:
1. Add `VITE_RAZORPAY_KEY_ID` in hosting platform dashboard
2. Trigger new deployment
3. Verify in browser console

### Issue: "Redirect URI mismatch" error
**Cause**: Google OAuth redirect URI not configured
**Fix**:
1. Copy the exact error message showing the redirect URI
2. Add that exact URI to Google Cloud Console
3. Wait 5 minutes for changes to propagate

## 🚀 Quick Fix Commands

### For Vercel:
```bash
# Set environment variables via CLI
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_RAZORPAY_KEY_ID

# Trigger new deployment
vercel --prod
```

### For Netlify:
```bash
# Set environment variables via CLI
netlify env:set VITE_SUPABASE_URL "your_value"
netlify env:set VITE_SUPABASE_ANON_KEY "your_value"
netlify env:set VITE_RAZORPAY_KEY_ID "your_value"

# Trigger new deployment
netlify deploy --prod
```

## 📝 Example Configuration

### Your `.env` file (for local development):
```env
VITE_SUPABASE_URL=https://dkjkuxbadylsquvrclnk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_RAZORPAY_KEY_ID=rzp_test_RaqAfVV9DXXLjp
```

### Hosting Platform Environment Variables:
Same values as above, but set in hosting dashboard.

### Supabase URL Configuration:
- **Site URL**: `https://thankdoc.vercel.app` (or your actual domain)
- **Redirect URLs**: Include both localhost and production URLs

## ⚡ Common Mistakes

1. ❌ **Not redeploying after setting env vars** - Variables only work after rebuild
2. ❌ **Forgetting VITE_ prefix** - Vite requires this prefix for client-side variables
3. ❌ **Using localhost in production** - Update Site URL to production domain
4. ❌ **Not waiting for Google changes** - Google OAuth changes take ~5 minutes

## ✅ Success Indicators

After proper configuration, you should see:
- ✅ Google login redirects to your production domain
- ✅ Console shows `[Razorpay Config] Razorpay key loaded from: env`
- ✅ Razorpay modal opens successfully
- ✅ Payments complete and bookings are created
- ✅ No "localhost refused to connect" errors

## 🆘 Still Having Issues?

If issues persist:
1. **Clear browser cache** completely
2. **Test in incognito/private mode**
3. **Check browser console** for specific errors
4. **Verify environment variables** are actually set in hosting platform
5. **Rebuild/redeploy** the application
6. **Check Supabase logs** for authentication errors

The key is: **Environment variables must be set in your hosting platform AND you must rebuild/redeploy after setting them!**
