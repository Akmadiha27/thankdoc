# Razorpay Configuration Setup

## Environment Variables Required

Create a `.env` file in your project root with your actual Razorpay credentials:

```env
# Supabase Configuration (if not already set)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Razorpay Configuration - Replace with your actual credentials
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY_ID_HERE
```

## How to Get Your Razorpay Credentials

1. **Sign up at Razorpay Dashboard**: https://dashboard.razorpay.com/
2. **Complete KYC verification** (required for live payments)
3. **Get your API keys**:
   - Go to Settings > API Keys
   - Copy your **Key ID** (this is your publishable key)
   - Copy your **Key Secret** (keep this secure, use for backend verification)

## Test vs Live Mode

- **Test Mode**: Use `rzp_test_` keys for development/testing
- **Live Mode**: Use `rzp_live_` keys for production

## Current Implementation Status

✅ Razorpay integration is fully implemented
✅ Payment flow is ready
✅ Error handling is in place
✅ Success callbacks are configured
✅ Responsive design is implemented

## Next Steps

1. Add your Razorpay Key ID to the `.env` file
2. Test the payment flow with test cards
3. Deploy with your live credentials for production

## Test Cards (Razorpay Test Mode)

- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date
