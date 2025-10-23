// Production Readiness Check Script
require('dotenv').config();
const cityDepartments = require('./config/cityDepartments');

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║                                                               ║');
console.log('║   🚀 URBANPULSE - PRODUCTION READINESS CHECK 🚀               ║');
console.log('║                                                               ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

let allPassed = true;
const errors = [];
const warnings = [];

// ============ CHECK 1: Environment Variables ============
console.log('📋 1. ENVIRONMENT VARIABLES CHECK\n');

const envChecks = {
  'MONGO_URI': process.env.MONGO_URI,
  'ULTRAMSG_INSTANCE_ID': process.env.ULTRAMSG_INSTANCE_ID,
  'ULTRAMSG_TOKEN': process.env.ULTRAMSG_TOKEN,
  'BACKEND_URL': process.env.BACKEND_URL,
  'FRONTEND_URL': process.env.FRONTEND_URL,
  'PORT': process.env.PORT || '5000',
  'NODE_ENV': process.env.NODE_ENV
};

for (const [key, value] of Object.entries(envChecks)) {
  const status = value ? '✅' : '❌';
  console.log(`   ${status} ${key}: ${value ? (key.includes('TOKEN') || key.includes('URI') ? '***SET***' : value) : '⚠️ NOT SET'}`);
  if (!value && key !== 'NODE_ENV') {
    allPassed = false;
    errors.push(`Missing environment variable: ${key}`);
  }
}

// ============ CHECK 2: WhatsApp Configuration ============
console.log('\n\n📱 2. WHATSAPP CONFIGURATION CHECK\n');

if (envChecks.ULTRAMSG_INSTANCE_ID && envChecks.ULTRAMSG_TOKEN) {
  console.log('   ✅ UltraMsg credentials configured');
  console.log(`   📍 Instance ID: ${envChecks.ULTRAMSG_INSTANCE_ID}`);
  console.log('   🔑 Token: ***HIDDEN***');
} else {
  console.log('   ❌ UltraMsg credentials MISSING');
  allPassed = false;
}

// ============ CHECK 3: Department Configuration ============
console.log('\n\n🏢 3. DEPARTMENT CONFIGURATION CHECK\n');

const cities = Object.keys(cityDepartments.cityDepartments || cityDepartments);
console.log(`   ✅ Total Cities Configured: ${cities.length}`);
console.log(`   📍 Cities: ${cities.join(', ')}\n`);

let totalDepartments = 0;
let defaultNumbers = 0;

cities.forEach(city => {
  const depts = cityDepartments.cityDepartments ? cityDepartments.cityDepartments[city] : cityDepartments[city];
  const categories = Object.keys(depts);
  totalDepartments += categories.length;
  
  console.log(`   🏙️  ${city}:`);
  categories.forEach(category => {
    const dept = depts[category];
    const isDefault = dept.whatsapp.includes('9676227890') || 
                     dept.whatsapp.includes('9848191129') || 
                     dept.whatsapp.includes('9876543');
    
    if (isDefault) {
      defaultNumbers++;
      console.log(`      ⚠️  ${category}: ${dept.whatsapp} (DEFAULT - NEEDS UPDATE)`);
      warnings.push(`${city} - ${category}: Using default/test WhatsApp number`);
    } else {
      console.log(`      ✅ ${category}: ${dept.whatsapp}`);
    }
  });
  console.log('');
});

console.log(`   📊 Total Departments: ${totalDepartments}`);
console.log(`   ⚠️  Departments with default numbers: ${defaultNumbers}`);

if (defaultNumbers > 0) {
  console.log(`   ⚠️  WARNING: ${defaultNumbers} departments still use test numbers!`);
  warnings.push(`${defaultNumbers} departments need WhatsApp number updates`);
}

// ============ CHECK 4: URLs Configuration ============
console.log('\n\n🌐 4. URL CONFIGURATION CHECK\n');

const backendUrl = envChecks.BACKEND_URL || 'http://localhost:5000';
const frontendUrl = envChecks.FRONTEND_URL || 'http://localhost:3000';

console.log(`   📡 Backend URL: ${backendUrl}`);
console.log(`   🖥️  Frontend URL: ${frontendUrl}`);

if (backendUrl.includes('localhost')) {
  console.log('   ⚠️  Backend is using localhost (Development mode)');
  warnings.push('Backend URL is localhost - update for production');
}

if (frontendUrl.includes('localhost')) {
  console.log('   ⚠️  Frontend is using localhost (Development mode)');
  warnings.push('Frontend URL is localhost - update for production');
}

// ============ CHECK 5: Production Mode ============
console.log('\n\n🔧 5. PRODUCTION MODE CHECK\n');

const isProduction = envChecks.NODE_ENV === 'production';
console.log(`   ${isProduction ? '✅' : '⚠️'} NODE_ENV: ${envChecks.NODE_ENV || 'development'}`);

if (!isProduction) {
  warnings.push('NODE_ENV is not set to production');
}

// ============ FINAL SUMMARY ============
console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║                    SUMMARY REPORT                             ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

if (allPassed && errors.length === 0) {
  console.log('✅ ✅ ✅  ALL CRITICAL CHECKS PASSED!  ✅ ✅ ✅\n');
} else {
  console.log('❌ ❌ ❌  CRITICAL ERRORS FOUND!  ❌ ❌ ❌\n');
  errors.forEach(err => console.log(`   ❌ ${err}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach(warn => console.log(`   ⚠️  ${warn}`));
  console.log('');
}

// ============ RECOMMENDATIONS ============
console.log('\n📝 RECOMMENDATIONS:\n');

if (defaultNumbers > 0) {
  console.log('   1️⃣  Update department officer WhatsApp numbers in config/cityDepartments.js');
  console.log('      Replace all test numbers with REAL officer WhatsApp numbers\n');
}

if (backendUrl.includes('localhost') || frontendUrl.includes('localhost')) {
  console.log('   2️⃣  Update production URLs in .env file');
  console.log('      BACKEND_URL=https://your-production-backend.com');
  console.log('      FRONTEND_URL=https://your-production-frontend.com\n');
}

if (!isProduction) {
  console.log('   3️⃣  Set NODE_ENV=production for production deployment\n');
}

console.log('   4️⃣  Ensure UltraMsg instance is connected at https://ultramsg.com');
console.log('      - Login to your account');
console.log('      - Check instance status (should be CONNECTED)');
console.log('      - Scan QR code if disconnected\n');

console.log('   5️⃣  Test the system:');
console.log('      - Run: node test-whatsapp.js');
console.log('      - Submit a test complaint');
console.log('      - Verify WhatsApp messages are received\n');

// ============ NEXT STEPS ============
console.log('\n🎯 NEXT STEPS FOR PRODUCTION:\n');
console.log('   □ Update all department WhatsApp numbers');
console.log('   □ Configure production URLs in .env');
console.log('   □ Set NODE_ENV=production');
console.log('   □ Connect UltraMsg instance');
console.log('   □ Run test-whatsapp.js to verify');
console.log('   □ Deploy backend to hosting service');
console.log('   □ Deploy frontend to hosting service');
console.log('   □ Submit test complaint end-to-end');
console.log('   □ Verify both WhatsApp messages received');
console.log('   □ Test status update functionality\n');

// ============ SUPPORT ============
console.log('\n📞 NEED HELP?\n');
console.log('   📖 Documentation: WHATSAPP_SETUP.md');
console.log('   🔍 Quick Reference: QUICK_REFERENCE.txt');
console.log('   🎯 Deployment Guide: See production deployment section\n');

console.log('═'.repeat(65));

if (allPassed && errors.length === 0 && warnings.length === 0) {
  console.log('\n🎉 🎉 🎉  SYSTEM IS PRODUCTION READY!  🎉 🎉 🎉\n');
  process.exit(0);
} else if (allPassed && errors.length === 0) {
  console.log('\n⚠️  SYSTEM IS FUNCTIONAL BUT HAS WARNINGS\n');
  process.exit(0);
} else {
  console.log('\n❌ CRITICAL ERRORS MUST BE FIXED BEFORE PRODUCTION\n');
  process.exit(1);
}
