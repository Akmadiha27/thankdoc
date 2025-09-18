// Razorpay Configuration
// Replace these values with your actual Razorpay keys

export const RAZORPAY_CONFIG = {
  // Test Environment
  TEST_KEY: "rzp_test_RaqAfVV9DXXLjp", // Replace with your test key
  
  // Live Environment  
  LIVE_KEY: "rzp_live_YOUR_LIVE_KEY_HERE", // Replace with your live key
  
  // Current Environment (change to 'live' for production)
  ENVIRONMENT: "test" as "test" | "live",
  
  // Default Settings
  CURRENCY: "INR",
  COMPANY_NAME: "ThankYouDoc",
  COMPANY_LOGO: "/placeholder.svg", // Replace with your logo URL
  THEME_COLOR: "#3B82F6",
  
  // Consultation Fee (in paisa - 1 INR = 100 paisa)
  CONSULTATION_FEE: 50000, // 500 INR
};

// Get current Razorpay key based on environment
export const getRazorpayKey = () => {
  return RAZORPAY_CONFIG.ENVIRONMENT === "test" 
    ? RAZORPAY_CONFIG.TEST_KEY 
    : RAZORPAY_CONFIG.LIVE_KEY;
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