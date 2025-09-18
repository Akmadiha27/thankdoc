import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

interface WebhookPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// You will need to get your Razorpay API Secret Key and add it to your Supabase project secrets.
// Go to Project Settings -> Secrets -> Add a new secret with the name RAZORPAY_API_SECRET
// NEVER expose your API Secret Key in frontend code.
const RAZORPAY_API_SECRET = Deno.env.get("RAZORPAY_API_SECRET");

serve(async (req) => {
  if (!RAZORPAY_API_SECRET) {
    return new Response(
      JSON.stringify({ error: "Razorpay API Secret not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const payload: WebhookPayload = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = payload;

    // Supabase client for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } },
    );

    // Implement Razorpay signature verification logic here
    // This typically involves hashing a string containing order_id, payment_id, and your secret
    // and comparing it with razorpay_signature
    // For example, using crypto:
    // const shasum = crypto.createHmac('sha256', RAZORPAY_API_SECRET);
    // shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    // const digest = shasum.digest('hex');

    // For now, we'll mock success. **REPLACE WITH ACTUAL VERIFICATION**
    const isSignatureValid = true; // Placeholder: REPLACE with actual verification logic

    if (isSignatureValid) {
      // Update your appointment status in Supabase if verification is successful
      // For example:
      // const { data, error } = await supabaseClient
      //   .from('appointments')
      //   .update({ payment_status: 'paid', razorpay_payment_id: razorpay_payment_id })
      //   .eq('razorpay_order_id', razorpay_order_id);

      return new Response(
        JSON.stringify({ status: "success", message: "Payment verified successfully" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } else {
      return new Response(
        JSON.stringify({ status: "failure", message: "Payment verification failed" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    console.error("Error in verify-razorpay-payment function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});

