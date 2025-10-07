// Razorpay Configuration
// DO NOT hardcode credentials here. The publishable key is provided via env var.

export const RAZORPAY_CONFIG = {
  // Current Environment (informational only)
  ENVIRONMENT: (import.meta.env.MODE === 'production' ? 'live' : 'test') as 'test' | 'live',
  
  // Default Settings
  CURRENCY: "INR",
  COMPANY_NAME: "ThankYouDoc",
  COMPANY_LOGO: "/placeholder.svg",
  THEME_COLOR: "#3B82F6",
  
  // Consultation Fee (in paisa - 1 INR = 100 paisa)
  CONSULTATION_FEE: 50000, // 500 INR
};

// Get current Razorpay publishable key from environment
// Set VITE_RAZORPAY_KEY_ID in your .env (frontend) or hosting env vars
export const getRazorpayKey = () => {
  const envKey = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;
  const runtimeKey = (globalThis as any)?.__RAZORPAY_KEY_ID as string | undefined;
  const storageKey = typeof localStorage !== 'undefined' ? localStorage.getItem('RAZORPAY_KEY_ID') || undefined : undefined;
  
  // Fallback test key for development (replace with your actual test key)
  const fallbackTestKey = 'rzp_test_RaqAfVV9DXXLjp';
  
  const key = envKey || runtimeKey || storageKey || fallbackTestKey;
  
  if (!envKey && !runtimeKey && !storageKey) {
    console.warn('[Razorpay Config] Using fallback test key. For production, set VITE_RAZORPAY_KEY_ID in env vars.');
    console.warn('[Razorpay Config] Add to .env file: VITE_RAZORPAY_KEY_ID=your_razorpay_key_here');
  } else {
    console.log('[Razorpay Config] Razorpay key loaded from:', envKey ? 'env' : runtimeKey ? 'runtime' : 'localStorage');
  }
  
  return key;
};

// Payment options interface
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any;
  }
}