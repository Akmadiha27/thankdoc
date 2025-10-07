// Environment Variables Verification Script
// Run with: node verify-env.js

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying Environment Configuration...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('   Create a .env file with your credentials\n');
  process.exit(1);
}

console.log('✅ .env file exists\n');

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

// Required variables
const required = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_RAZORPAY_KEY_ID'
];

const found = {};
envLines.forEach(line => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=').trim();
  if (key && value) {
    found[key.trim()] = value;
  }
});

console.log('📋 Checking Required Variables:\n');

let allGood = true;
required.forEach(varName => {
  const value = found[varName];
  if (!value) {
    console.log(`❌ ${varName}: MISSING`);
    allGood = false;
  } else if (value.includes('your_') || value.includes('YOUR_')) {
    console.log(`⚠️  ${varName}: Placeholder detected - replace with actual value`);
    console.log(`   Current: ${value.substring(0, 30)}...`);
    allGood = false;
  } else {
    console.log(`✅ ${varName}: Found`);
    console.log(`   Value: ${value.substring(0, 30)}...`);
  }
  console.log();
});

console.log('\n📝 Summary:\n');

if (allGood) {
  console.log('✅ All environment variables are properly configured!');
  console.log('\n📌 Next Steps:');
  console.log('   1. These work for LOCAL development');
  console.log('   2. For PRODUCTION, set these in your hosting platform:');
  console.log('      - Vercel: Settings → Environment Variables');
  console.log('      - Netlify: Site settings → Environment');
  console.log('   3. After setting them, REDEPLOY your application');
  console.log('   4. Update Supabase Site URL to your production domain');
  console.log('\n');
} else {
  console.log('❌ Some environment variables need attention!');
  console.log('\n📌 To Fix:');
  console.log('   1. Update .env file with actual values');
  console.log('   2. Remove any placeholder text');
  console.log('   3. Get credentials from:');
  console.log('      - Supabase: https://supabase.com/dashboard');
  console.log('      - Razorpay: https://dashboard.razorpay.com/');
  console.log('\n');
}

console.log('🚀 Deployment Reminders:');
console.log('   • Environment variables in .env work ONLY locally');
console.log('   • For production, set them in hosting platform dashboard');
console.log('   • Must REBUILD after adding environment variables');
console.log('   • Update Supabase URLs to production domain');
console.log('   • See QUICK_DEPLOYMENT_GUIDE.md for details\n');

