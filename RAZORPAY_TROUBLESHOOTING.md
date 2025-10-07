# Razorpay Integration Troubleshooting Guide

## ✅ What Has Been Fixed

The Razorpay payment button is now fully functional with:
- ✅ Better error handling and logging
- ✅ Fallback test key for development
- ✅ Clear console messages for debugging
- ✅ User-friendly error messages
- ✅ Payment success/failure/cancel handling

## 🔧 How to Test the Payment Integration

### Step 1: Check Browser Console
When you click "Confirm Booking", you should see these console messages:
```
[Booking] Initiating Razorpay payment...
[Razorpay] Initiating payment...
[Razorpay] Script loaded successfully
[Razorpay Config] Razorpay key loaded from: env (or fallback)
[Razorpay] Key found: rzp_test_Ra...
[Razorpay] Amount in paisa: 50000
[Razorpay] Opening Razorpay checkout...
```

### Step 2: Razorpay Modal Should Open
- A payment modal should appear
- You should see the consultation fee
- Patient details should be pre-filled

### Step 3: Test with Test Card
Use these test card details:
- **Card Number**: `4111 1111 1111 1111`
- **CVV**: Any 3 digits (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/25`)
- **Name**: Any name

### Step 4: Verify Success
After successful payment:
- You'll see a success toast message
- You'll be redirected to bookings page
- The appointment will be created with payment ID

## 🐛 Common Issues and Solutions

### Issue 1: "Razorpay key not found"
**Solution**: The fallback key is now in place, but for production:
1. Create a `.env` file in your project root
2. Add: `VITE_RAZORPAY_KEY_ID=your_actual_razorpay_key_here`
3. Restart your development server

### Issue 2: Razorpay Modal Doesn't Open
**Checks**:
1. Open browser console (F12)
2. Look for Razorpay error messages
3. Check if script loaded: `console.log(window.Razorpay)`
4. Verify internet connection (script loads from CDN)

### Issue 3: Payment Button Does Nothing
**Debug Steps**:
1. Check browser console for errors
2. Verify you've filled in patient details (name, email, contact)
3. Check if "Pay with Razorpay" is selected (not "Pay at Clinic")
4. Look for any error toasts

### Issue 4: "Failed to load Razorpay"
**Solution**:
- Check internet connection
- Check if firewall is blocking `checkout.razorpay.com`
- Try refreshing the page
- Clear browser cache

## 📝 Environment Variables Setup

Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY_ID
```

### Getting Your Razorpay Keys

1. **Sign up** at https://dashboard.razorpay.com/
2. **Navigate** to Settings > API Keys
3. **Copy** your Key ID (starts with `rzp_test_` for test mode)
4. **Add** to `.env` file
5. **Restart** your development server

## 🧪 Testing Flow

### Complete Test Scenario
1. Go to a doctor's profile page
2. Click "Book Appointment"
3. Fill in patient details:
   - Name: Test Patient
   - Email: test@example.com
   - Phone: 9876543210
   - Age: 30
   - Gender: Male
   - Problem: Test consultation
4. Select "Pay with Razorpay"
5. Click "Confirm Booking"
6. Razorpay modal should open
7. Enter test card: `4111 1111 1111 1111`
8. Complete payment
9. Verify booking appears in bookings page

## 📊 Console Logging

All payment operations now log to console with prefixes:
- `[Razorpay Config]` - Configuration messages
- `[Razorpay]` - Payment initialization and execution
- `[Booking]` - Booking flow messages
- `[DEBUG]` - Debug information

Check these logs to understand what's happening at each step.

## 🚀 Production Deployment

Before going live:
1. ✅ Replace test key with live key
2. ✅ Set environment variables in hosting platform
3. ✅ Test with real payment (small amount)
4. ✅ Set up webhooks in Razorpay dashboard
5. ✅ Configure proper error tracking

## 💡 Tips

- Always test in test mode first
- Use test cards for development
- Check Razorpay dashboard for payment logs
- Monitor browser console for any errors
- Use incognito mode to test fresh user experience

## 🆘 Still Having Issues?

If Razorpay still doesn't work:
1. **Check console logs** - Copy all errors
2. **Verify Razorpay key** - Make sure it's valid
3. **Test internet** - Ensure script can load
4. **Try different browser** - Rule out browser issues
5. **Check firewall** - May be blocking Razorpay CDN

The fallback test key (`rzp_test_RaqAfVV9DXXLjp`) is now in place, so the button should work out of the box for testing!
