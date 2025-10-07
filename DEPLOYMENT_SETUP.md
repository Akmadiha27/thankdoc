# Deployment Setup Guide

## Google OAuth Configuration

### 1. Update Supabase Auth Settings

The `supabase/config.toml` has been updated with the correct redirect URLs. You need to update your Supabase project settings:

1. Go to your Supabase Dashboard
2. Navigate to Authentication > URL Configuration
3. Update the following URLs:
   - **Site URL**: `https://thankdoc.vercel.app`
   - **Redirect URLs**: Add these URLs:
     - `https://thankdoc.vercel.app`
     - `https://thankdoc.vercel.app/auth/callback`
     - `https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback`
     - `http://localhost:5173` (for development)
     - `http://localhost:3000` (for development)

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Add authorized redirect URIs:
   - `https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback`
   - `https://thankdoc.vercel.app/auth/callback`
6. Copy the Client ID and add it to your Supabase project settings

## Razorpay Payment Gateway Setup

### 1. Environment Variables

Create a `.env` file in your project root with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

### 2. Razorpay Account Setup

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Complete KYC verification
3. Get your API keys:
   - **Key ID** (Publishable Key) - Use this for `VITE_RAZORPAY_KEY_ID`
   - **Key Secret** (Private Key) - Keep this secure, use for backend verification

### 3. Webhook Configuration

Set up webhooks in Razorpay dashboard:
- **Webhook URL**: `https://your-domain.com/api/razorpay-webhook`
- **Events**: `payment.captured`, `payment.failed`

### 4. Testing

For testing, use Razorpay test mode:
- Test cards: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Deployment Steps

### 1. Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`
3. Deploy

### 2. Update Supabase Settings

After deployment, update your Supabase project with the actual production URL.

## Troubleshooting

### Google OAuth Issues
- Ensure redirect URLs match exactly
- Check that Google OAuth is enabled in Supabase
- Verify Client ID is correct

### Razorpay Issues
- Check that Razorpay script loads correctly
- Verify API key is set correctly
- Check browser console for errors

### General Issues
- Clear browser cache
- Check network connectivity
- Verify all environment variables are set
