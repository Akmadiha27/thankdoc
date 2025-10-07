import { QR_PAYMENT_CONFIG } from "@/config/qr-payment";
import { RAZORPAY_CONFIG, getRazorpayKey, RazorpayOptions, RazorpayResponse } from "@/config/razorpay";

/**
 * Interface for QR payment response
 */
export interface QrPaymentResponse {
  referenceNumber: string;
  amount: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  upiId: string;
  qrCodeUrl: string;
}

/**
 * Interface for initiateQRPayment parameters
 */
export interface InitiateQRPaymentParams {
  amount: number;
  doctorName: string;
  patientName: string;
  onSuccess: (response: QrPaymentResponse) => void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
}

/**
 * Initiates a QR payment flow
 */
export const initiateQRPayment = ({
  amount,
  doctorName,
  patientName,
  onSuccess,
  onFailure,
  onDismiss,
}: InitiateQRPaymentParams) => {
  // Generate a unique reference number
  const referenceNumber = `TXD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Create payment details
  const paymentDetails: QrPaymentResponse = {
    referenceNumber,
    amount,
    timestamp: new Date().toISOString(),
    status: 'pending',
    upiId: QR_PAYMENT_CONFIG.UPI_ID,
    qrCodeUrl: generateQRCodeUrl({
      upiId: QR_PAYMENT_CONFIG.UPI_ID,
      amount,
      referenceNumber,
      merchantName: QR_PAYMENT_CONFIG.MERCHANT_NAME,
      currency: QR_PAYMENT_CONFIG.CURRENCY,
    }),
  };

  // Simulate API call with timeout
  setTimeout(() => {
    onSuccess(paymentDetails);
  }, 500);
};

/**
 * Generates a QR code URL for UPI payment
 */
export const generateQRCodeUrl = (params: {
  upiId: string;
  amount: number;
  referenceNumber: string;
  merchantName: string;
  currency: string;
}) => {
  // Generate UPI payment link
  const upiLink = `upi://pay?pa=${params.upiId}&pn=${encodeURIComponent(params.merchantName)}&am=${params.amount}&cu=${params.currency}&tn=${encodeURIComponent('Payment for consultation')}`;
  
  // Return a QR code generator URL
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
};

/**
 * Interface for Razorpay payment parameters
 */
export interface InitiateRazorpayParams {
  amountInRupees: number;
  patientName: string;
  patientEmail: string;
  patientContact: string;
  description: string;
  onSuccess: (response: RazorpayResponse) => void;
  onFailure?: (err: any) => void;
  onDismiss?: () => void;
}

/**
 * Loads Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initiates a Razorpay Checkout payment
 */
export const initiateRazorpayPayment = async ({
  amountInRupees,
  patientName,
  patientEmail,
  patientContact,
  description,
  onSuccess,
  onFailure,
  onDismiss,
}: InitiateRazorpayParams) => {
  try {
    console.log('[Razorpay] Initiating payment...', { amountInRupees, patientName });
    
    // Load Razorpay script
    const ok = await loadRazorpayScript();
    if (!ok) {
      console.error('[Razorpay] Failed to load Razorpay script');
      onFailure?.(new Error('Failed to load Razorpay. Please check your internet connection.'));
      return;
    }
    
    console.log('[Razorpay] Script loaded successfully');

    // Get and validate Razorpay key
    const razorpayKey = getRazorpayKey();
    if (!razorpayKey) {
      console.error('[Razorpay] Razorpay key not found');
      onFailure?.(new Error('Razorpay is not configured. Please contact support.'));
      return;
    }
    
    console.log('[Razorpay] Key found:', razorpayKey.substring(0, 10) + '...');

    const amountInPaisa = Math.round((amountInRupees || 0) * 100);
    console.log('[Razorpay] Amount in paisa:', amountInPaisa);

    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: amountInPaisa,
      currency: RAZORPAY_CONFIG.CURRENCY,
      name: RAZORPAY_CONFIG.COMPANY_NAME,
      description: description || 'Consultation payment',
      image: RAZORPAY_CONFIG.COMPANY_LOGO,
      handler: (response: RazorpayResponse) => {
        console.log('[Razorpay] Payment successful:', response);
        onSuccess(response);
      },
      prefill: {
        name: patientName || '',
        email: patientEmail || '',
        contact: patientContact || '',
      },
      theme: { color: RAZORPAY_CONFIG.THEME_COLOR },
      modal: {
        ondismiss: () => {
          console.log('[Razorpay] Payment modal dismissed');
          onDismiss?.();
        },
      },
    };

    console.log('[Razorpay] Opening Razorpay checkout...');
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (err: any) => {
      console.error('[Razorpay] Payment failed:', err);
      onFailure?.(err);
    });
    rzp.open();
  } catch (error) {
    console.error('[Razorpay] Unexpected error:', error);
    onFailure?.(error);
  }
};