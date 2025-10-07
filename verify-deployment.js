#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script helps verify that your deployment is properly configured
 * Run this after deploying to check if everything is working
 */

const https = require('https');
const http = require('http');

// Configuration - Update these with your actual domain
const CONFIG = {
  // Replace with your actual deployed domain
  PRODUCTION_URL: 'https://your-domain.vercel.app', // Update this!
  
  // Expected routes to test
  ROUTES_TO_TEST: [
    '/',
    '/login',
    '/signup',
    '/search',
    '/bookings',
    '/profile'
  ],
  
  // Environment variables to check
  EXPECTED_ENV_VARS: [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_RAZORPAY_KEY_ID'
  ]
};

console.log('🔍 Deployment Verification Script');
console.log('================================\n');

// Test if a URL returns 200 status
function testUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode === 200
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });
  });
}

// Test SPA routing
async function testSPARouting() {
  console.log('📱 Testing SPA Routing...');
  
  const results = [];
  for (const route of CONFIG.ROUTES_TO_TEST) {
    const url = CONFIG.PRODUCTION_URL + route;
    const result = await testUrl(url);
    results.push(result);
    
    const status = result.success ? '✅' : '❌';
    console.log(`  ${status} ${route} - Status: ${result.status}`);
  }
  
  const allPassed = results.every(r => r.success);
  console.log(`\n  SPA Routing: ${allPassed ? '✅ PASSED' : '❌ FAILED'}\n`);
  
  return allPassed;
}

// Generate test instructions
function generateTestInstructions() {
  console.log('🧪 Manual Testing Instructions');
  console.log('==============================\n');
  
  console.log('1. Open your production site in incognito/private mode:');
  console.log(`   ${CONFIG.PRODUCTION_URL}\n`);
  
  console.log('2. Test SPA Routing:');
  console.log('   - Navigate to different routes');
  console.log('   - Reload each page - should NOT show 404\n');
  
  console.log('3. Test Google Login:');
  console.log('   - Go to /login');
  console.log('   - Click "Sign In with Google"');
  console.log('   - Should redirect to Google (not localhost)');
  console.log('   - After auth, should return to your site\n');
  
  console.log('4. Check Environment Variables:');
  console.log('   - Open browser console (F12)');
  console.log('   - Type: console.log(import.meta.env)');
  console.log('   - Should see your env vars (not undefined)\n');
  
  console.log('5. Test Razorpay (if configured):');
  console.log('   - Try to book an appointment');
  console.log('   - Should see Razorpay modal\n');
}

// Main verification function
async function verifyDeployment() {
  console.log(`Testing deployment at: ${CONFIG.PRODUCTION_URL}\n`);
  
  // Test SPA routing
  const spaRoutingWorks = await testSPARouting();
  
  // Generate test instructions
  generateTestInstructions();
  
  // Summary
  console.log('📋 Summary');
  console.log('==========\n');
  
  if (spaRoutingWorks) {
    console.log('✅ SPA routing appears to be working');
    console.log('✅ 404 errors on reload should be fixed\n');
  } else {
    console.log('❌ SPA routing issues detected');
    console.log('❌ You may still see 404 errors on reload\n');
  }
  
  console.log('🔧 Next Steps:');
  console.log('1. Follow the manual testing instructions above');
  console.log('2. If Google login still doesn\'t work:');
  console.log('   - Check Supabase URL configuration');
  console.log('   - Verify Google Cloud Console redirect URIs');
  console.log('   - Wait 5-10 minutes for changes to propagate');
  console.log('3. If environment variables are undefined:');
  console.log('   - Set them in your hosting platform dashboard');
  console.log('   - Trigger a new deployment');
  console.log('4. Test everything in incognito/private mode\n');
  
  console.log('📚 See DEPLOYMENT_FIX_GUIDE.md for detailed instructions');
}

// Check if URL is configured
if (CONFIG.PRODUCTION_URL.includes('your-domain')) {
  console.log('⚠️  Please update CONFIG.PRODUCTION_URL with your actual domain!');
  console.log('   Edit this script and replace "your-domain" with your actual deployed URL\n');
}

// Run verification
verifyDeployment().catch(console.error);
