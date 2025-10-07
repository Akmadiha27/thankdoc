# Payment Integration Test Guide

## Testing Razorpay Integration

### 1. Environment Setup
Make sure you have set the following environment variable:
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id
```

### 2. Test Scenarios

#### Test 1: Razorpay Payment Flow
1. Navigate to any doctor profile page
2. Click "Book Appointment"
3. Fill in patient details
4. Select "Pay with Razorpay" as payment method
5. Click "Confirm Booking"
6. Razorpay checkout should open
7. Use test card: 4111 1111 1111 1111
8. Complete payment
9. Verify booking is created with payment ID

#### Test 2: QR Payment Flow (Offline)
1. Navigate to any doctor profile page
2. Click "Book Appointment"
3. Fill in patient details
4. Select "Pay at Clinic" as payment method
5. Click "Confirm Booking"
6. QR code modal should open
7. Verify QR code is generated correctly

### 3. Expected Behavior

#### Razorpay Integration
- ✅ Razorpay script loads successfully
- ✅ Checkout modal opens with correct amount
- ✅ Payment form pre-fills with patient details
- ✅ Success callback triggers booking creation
- ✅ Error handling works for failed payments
- ✅ Dismiss handling works when user cancels

#### QR Payment Integration
- ✅ QR code generates with correct UPI details
- ✅ Reference number is unique
- ✅ Amount is correct
- ✅ UPI ID is from configuration

### 4. Debugging

If Razorpay doesn't work:
1. Check browser console for errors
2. Verify `VITE_RAZORPAY_KEY_ID` is set
3. Check if Razorpay script loaded: `window.Razorpay` should exist
4. Verify network requests to Razorpay API

### 5. Test Cards (Razorpay)

**Success Cases:**
- 4111 1111 1111 1111 (Visa)
- 5555 5555 5555 4444 (Mastercard)

**Failure Cases:**
- 4000 0000 0000 0002 (Declined)
- 4000 0000 0000 0069 (Expired)

**Authentication Required:**
- 4000 0000 0000 0028 (Authentication required)

### 6. Production Checklist

Before going live:
- [ ] Replace test Razorpay key with live key
- [ ] Update environment to production mode
- [ ] Test with real payment methods
- [ ] Set up webhook endpoints
- [ ] Configure proper error handling
- [ ] Test refund flow if needed
