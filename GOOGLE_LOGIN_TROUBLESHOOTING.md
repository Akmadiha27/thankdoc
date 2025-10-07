# 🔧 Google Login Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Issue 1: "Google login not working" - General Debugging

**Step 1: Use the Debug Tool**
1. Go to your login page
2. Click the "🐛 Debug Google Login" button (bottom-right corner)
3. Click "Test Connection" and "Test OAuth"
4. Check browser console (F12) for detailed error messages
5. Copy the debug info and share it

**Step 2: Check Environment Variables**
Open browser console and type:
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
```

If you see `undefined`, your environment variables aren't set in production.

### Issue 2: "Redirect URI mismatch" Error

**Symptoms:**
- Google login redirects to Google
- Shows "Error 400: redirect_uri_mismatch"
- Doesn't return to your app

**Solutions:**

**A. Update Google Cloud Console:**
1. Go to https://console.cloud.google.com/
2. Navigate to APIs & Services → Credentials
3. Click your OAuth 2.0 Client ID
4. Add these Authorized redirect URIs:
   ```
   https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback
   https://your-actual-domain.vercel.app/auth/v1/callback
   ```
5. Save and wait 5-10 minutes

**B. Update Supabase Dashboard:**
1. Go to https://supabase.com/dashboard
2. Select your project → Authentication → URL Configuration
3. Update Site URL to your production domain
4. Add these Redirect URLs:
   ```
   https://your-actual-domain.vercel.app
   https://your-actual-domain.vercel.app/auth/v1/callback
   https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback
   ```

### Issue 3: "Environment variables undefined"

**Symptoms:**
- Console shows `undefined` for env variables
- App works locally but not in production

**Solutions:**

**For Vercel:**
1. Go to project → Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Trigger new deployment** (crucial!)

**For Netlify:**
1. Site settings → Build & deploy → Environment
2. Add same variables
3. Trigger redeploy

### Issue 4: "Google provider not enabled"

**Symptoms:**
- Error: "Provider not enabled"
- Google login button does nothing

**Solution:**
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID (from Google Cloud Console)
   - Client Secret (from Google Cloud Console)
4. Save

### Issue 5: "localhost refused to connect"

**Symptoms:**
- Google login redirects to localhost instead of production
- "This site can't be reached" error

**Solution:**
- Update Supabase Site URL to your production domain
- Update Google Cloud Console redirect URIs to production

## 🔍 Debugging Checklist

### ✅ Environment Check
- [ ] Environment variables set in hosting platform
- [ ] New deployment triggered after setting env vars
- [ ] Console shows env vars (not undefined)

### ✅ Supabase Configuration
- [ ] Site URL set to production domain
- [ ] Redirect URLs include production domain
- [ ] Google provider enabled
- [ ] Google credentials added

### ✅ Google Cloud Console
- [ ] OAuth consent screen configured
- [ ] Authorized redirect URIs include Supabase callback
- [ ] Client ID and Secret are correct

### ✅ Browser/Network
- [ ] Testing in incognito/private mode
- [ ] Browser cache cleared
- [ ] No ad blockers interfering
- [ ] Console shows no JavaScript errors

## 🛠️ Alternative Solutions

### Solution 1: Use Different Redirect URL
Try updating the redirect URL in the code:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/`, // Try this instead
  },
});
```

### Solution 2: Manual OAuth Flow
If automatic OAuth doesn't work, implement manual flow:

```typescript
const handleGoogleSignIn = async () => {
  try {
    // Get the OAuth URL manually
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        skipBrowserRedirect: true, // Get URL instead of redirecting
      }
    });
    
    if (data?.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    console.error('OAuth error:', error);
  }
};
```

### Solution 3: Test with Different Providers
Try enabling other OAuth providers (GitHub, Discord) to isolate if it's a Google-specific issue.

## 📞 Getting Help

### Information to Provide:
1. **Debug info** from the debugger tool
2. **Browser console errors** (screenshot)
3. **Your actual domain** (not localhost)
4. **Hosting platform** (Vercel, Netlify, etc.)
5. **Error messages** you see

### Quick Test Commands:
```javascript
// In browser console:
console.log('Current origin:', window.location.origin);
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key set:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Test Supabase connection:
supabase.auth.getSession().then(console.log);
```

## 🎯 Most Common Fix

**90% of Google login issues are caused by:**
1. **Missing environment variables in hosting platform**
2. **Not redeploying after setting environment variables**
3. **Wrong redirect URLs in Google Cloud Console**

**Quick Fix:**
1. Set environment variables in your hosting platform
2. Redeploy your app
3. Update Google Cloud Console redirect URIs
4. Wait 10 minutes for changes to propagate
5. Test in incognito mode

## 🚀 Success Indicators

You'll know it's working when:
- ✅ Google login redirects to Google (not localhost)
- ✅ After authentication, returns to your production site
- ✅ User is logged in and session persists
- ✅ No console errors
- ✅ Debug tool shows all green checkmarks
