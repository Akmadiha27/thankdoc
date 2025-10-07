# 🔧 Fix "requested path is invalid" Error

## 🚨 The Problem
The error `{"error":"requested path is invalid"}` means your redirect URIs don't match between:
- Google Cloud Console
- Supabase Dashboard  
- Your application code

## ✅ **FIXED IN CODE** - Updated Application Logic

I've updated your code to automatically use the correct redirect URL:
- **Production**: Uses `https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback`
- **Development**: Uses `http://localhost:5173/auth/v1/callback`

## 🎯 Step-by-Step Fix

### Step 1: Deploy the Updated Code
```bash
git add .
git commit -m "Fix Google OAuth redirect URI for production"
git push
```

### Step 2: Update Google Cloud Console

**Go to:** https://console.cloud.google.com/
1. Select your project
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your **OAuth 2.0 Client ID**
4. Under **Authorized redirect URIs**, make sure you have these EXACT URLs:

```
https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback
http://localhost:5173/auth/v1/callback
http://localhost:3000/auth/v1/callback
```

**⚠️ IMPORTANT**: The code now uses the Supabase callback URL for production, so you MUST have `https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback` in your Google Cloud Console!

### Step 3: Update Supabase Dashboard

**Go to:** https://supabase.com/dashboard
1. Select your project
2. Navigate to **Authentication** → **URL Configuration**
3. Update these settings:

**Site URL:**
```
https://your-actual-domain.vercel.app
```

**Redirect URLs (add ALL of these):**
```
https://your-actual-domain.vercel.app
https://your-actual-domain.vercel.app/
https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback
http://localhost:5173
http://localhost:3000
```

### Step 4: Verify Google Provider in Supabase

**In Supabase Dashboard:**
1. Go to **Authentication** → **Providers**
2. Find **Google** provider
3. Make sure it's **Enabled**
4. Verify you have:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)

## 🔍 How to Test the Fix

### 1. Check the Console Logs
When you click "Sign in with Google", you should see:
```
🔍 Starting Google OAuth...
📍 Current origin: https://your-domain.vercel.app
📍 Current hostname: your-domain.vercel.app
🌐 Production mode - using Supabase callback URL
🎯 Using redirect URL: https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback
```

### 2. Test the OAuth Flow
1. Click "Sign in with Google"
2. Should redirect to Google (not localhost)
3. After authentication, should return to your site
4. You should be logged in

## 🐛 If Still Getting "requested path is invalid"

### Check These Common Issues:

**Issue 1: Wrong Client ID**
- Make sure you're using the correct Google Client ID in Supabase
- The Client ID should match the one in Google Cloud Console

**Issue 2: Missing Redirect URI in Google Cloud Console**
- Double-check that `https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback` is in your Google Cloud Console
- Make sure there are no typos or extra spaces

**Issue 3: Google Provider Not Enabled**
- Check that Google provider is enabled in Supabase Dashboard
- Verify Client ID and Secret are correct

**Issue 4: OAuth Consent Screen**
- Make sure your OAuth consent screen is configured in Google Cloud Console
- Add your domain to authorized domains if required

## 🧪 Debug Commands

Run these in your browser console to debug:

```javascript
// Check current environment
console.log('Origin:', window.location.origin);
console.log('Hostname:', window.location.hostname);
console.log('Is production:', !window.location.hostname.includes('localhost'));

// Test Supabase connection
supabase.auth.getSession().then(console.log);
```

## 📞 Need Help?

If you're still getting the error, please share:
1. Your actual deployed domain
2. The exact error message
3. Console logs when you try Google login
4. Screenshot of your Google Cloud Console redirect URIs

## ✅ Success Indicators

You'll know it's working when:
- ✅ Console shows "🌐 Production mode - using Supabase callback URL"
- ✅ Google login redirects to Google (not localhost)
- ✅ After authentication, returns to your production site
- ✅ User is logged in successfully
- ✅ No "requested path is invalid" error
