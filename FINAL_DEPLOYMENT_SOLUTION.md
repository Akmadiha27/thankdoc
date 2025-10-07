# 🎯 Complete Solution: Google Login & Razorpay After Deployment

## 🚨 Why Your .env File Doesn't Work in Production

**The Critical Truth:**
- Your `.env` file works perfectly **locally**
- But Vite **bakes** environment variables during BUILD TIME
- Your hosting platform doesn't use `.env` files
- You MUST set environment variables in your hosting dashboard

## ✅ Complete Fix (Step by Step)

### Step 1: Verify Your Local .env File

Run this command to check your setup:
```bash
npm run verify-env
```

Your `.env` should have:
```env
VITE_SUPABASE_URL=https://dkjkuxbadylsquvrclnk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_RAZORPAY_KEY_ID=rzp_test_RaqAfVV9DXXLjp
```

### Step 2: Set Environment Variables in Hosting Platform

#### **For Vercel (Most Common):**

1. **Go to your Vercel project dashboard**
2. **Click on "Settings"**
3. **Navigate to "Environment Variables"**
4. **Add each variable:**
   - Click "Add New"
   - Variable name: `VITE_SUPABASE_URL`
   - Value: Copy from your `.env` file
   - Select: Production, Preview, Development
   - Click "Save"
5. **Repeat for:**
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`

#### **For Netlify:**

1. **Go to Site settings**
2. **Click "Build & deploy"**
3. **Click "Environment"**
4. **Add variables** (same as above)

#### **For Other Platforms:**

Most platforms have a similar "Environment Variables" or "Config Variables" section in their dashboard.

### Step 3: Redeploy Your Application

**CRITICAL:** After adding environment variables, you MUST redeploy:

**Vercel:**
- Go to "Deployments" tab
- Click "..." on latest deployment
- Click "Redeploy"

**Netlify:**
- Go to "Deploys"
- Click "Trigger deploy"
- Select "Deploy site"

**Or push a new commit:**
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push
```

### Step 4: Fix Google Login (Supabase URLs)

**Go to Supabase Dashboard:**
1. Open https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**

**Update Site URL:**
```
https://your-actual-site.vercel.app
```
(Replace with YOUR actual deployed domain)

**Update Redirect URLs** (add ALL of these):
```
https://your-actual-site.vercel.app
https://your-actual-site.vercel.app/
https://your-actual-site.vercel.app/auth/callback
https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback
http://localhost:5173
http://localhost:3000
```

### Step 5: Update Google Cloud OAuth Settings

**Go to Google Cloud Console:**
1. Open https://console.cloud.google.com/
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID

**Add Authorized redirect URIs:**
```
https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback
https://your-actual-site.vercel.app/auth/callback
```

**Save changes** and wait 5-10 minutes for propagation.

### Step 6: Verify Supabase Google Provider

**In Supabase Dashboard:**
1. Go to **Authentication** → **Providers**
2. Find **Google** provider
3. **Enable it**
4. Add your:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
5. **Save**

## 🧪 Testing Your Deployment

### Test Environment Variables:
1. Open your production site
2. Open browser console (F12)
3. Type: `console.log(import.meta.env)`
4. You should see your variables (not undefined)

### Test Google Login:
1. Open production site in **incognito/private mode**
2. Click "Sign in with Google"
3. Should redirect to Google (NOT localhost)
4. After authentication, should return to production site
5. You should be logged in

### Test Razorpay:
1. Go to a doctor profile
2. Click "Book Appointment"
3. Fill in details
4. Select "Pay with Razorpay"
5. Click "Confirm Booking"
6. Check console for:
   ```
   [Razorpay Config] Razorpay key loaded from: env
   ```
7. Razorpay modal should open
8. Complete test payment

## 🐛 Troubleshooting

### Issue: "localhost refused to connect"
**Cause:** Supabase Site URL still points to localhost
**Fix:** Update Supabase Site URL to your production domain

### Issue: Razorpay shows "Using fallback test key"
**Cause:** Environment variable not set OR haven't redeployed
**Fix:** 
1. Verify `VITE_RAZORPAY_KEY_ID` is set in hosting platform
2. Trigger a new deployment
3. Clear browser cache

### Issue: Google OAuth "redirect_uri_mismatch"
**Cause:** Missing redirect URI in Google Cloud Console
**Fix:** 
1. Copy the exact redirect URI from the error message
2. Add it to Google Cloud Console → OAuth Client
3. Wait 5-10 minutes

### Issue: Environment variables show as undefined
**Cause:** Haven't redeployed after setting variables
**Fix:** Trigger a new deployment (variables only work after rebuild)

## 📋 Complete Checklist

### Before Deployment:
- [x] .env file exists with all credentials
- [x] Tested locally with `npm run dev`
- [x] Run `npm run verify-env` to check setup

### In Hosting Platform:
- [ ] Set `VITE_SUPABASE_URL` in environment variables
- [ ] Set `VITE_SUPABASE_ANON_KEY` in environment variables
- [ ] Set `VITE_RAZORPAY_KEY_ID` in environment variables
- [ ] Triggered a NEW deployment (not just restart!)

### In Supabase Dashboard:
- [ ] Site URL updated to production domain
- [ ] Production domain added to Redirect URLs
- [ ] Google provider enabled with credentials
- [ ] All URLs saved and confirmed

### In Google Cloud Console:
- [ ] Production redirect URI added
- [ ] Supabase callback URI added
- [ ] Changes saved

### After Deployment:
- [ ] Tested Google login (no localhost error)
- [ ] Verified environment variables in console
- [ ] Tested Razorpay payment flow
- [ ] Confirmed bookings are created

## ⏱️ Expected Timeline

- **Setting environment variables:** 3-5 minutes
- **Redeploying application:** 3-5 minutes  
- **Updating Supabase settings:** 2-3 minutes
- **Updating Google OAuth:** 2-3 minutes
- **Waiting for propagation:** 5-10 minutes
- **Total:** ~20-25 minutes

## 💡 Key Takeaways

1. **.env files are for LOCAL development only**
2. **Production needs variables in hosting dashboard**
3. **MUST redeploy after adding environment variables**
4. **Supabase Site URL must be production domain**
5. **Google OAuth URIs must include production domain**

## 🎉 Success Indicators

When everything works correctly:
- ✅ Google login redirects to production domain
- ✅ No "localhost refused to connect" errors
- ✅ Console shows: `Razorpay key loaded from: env`
- ✅ Razorpay modal opens with your actual key
- ✅ Payments complete successfully
- ✅ Bookings are created in database

## 📚 Additional Resources

- **QUICK_DEPLOYMENT_GUIDE.md** - Quick reference card
- **DEPLOYMENT_FIX.md** - Detailed troubleshooting
- **RAZORPAY_TROUBLESHOOTING.md** - Razorpay-specific issues
- Run `npm run verify-env` - Check local environment setup

## 🆘 Still Having Issues?

1. **Run the verification script:**
   ```bash
   npm run verify-env
   ```

2. **Check browser console** for specific error messages

3. **Verify in hosting platform** that variables are actually set

4. **Confirm you've redeployed** after setting variables

5. **Test in incognito/private mode** to avoid cache issues

6. **Wait 10-15 minutes** after changing OAuth settings

## 🚀 Quick Commands Reference

```bash
# Verify local environment
npm run verify-env

# Build for production
npm run build

# Test production build locally
npm run preview

# Deploy to Vercel (if using Vercel CLI)
vercel --prod
```

---

**Remember:** The key to success is:
1. Set environment variables in hosting platform
2. REDEPLOY the application
3. Update Supabase URLs to production domain
4. Wait for changes to propagate

Your `.env` file already has the correct values - you just need to copy them to your hosting platform and redeploy! 🎯
