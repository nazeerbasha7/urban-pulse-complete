// Test WhatsApp Integration
require('dotenv').config();
const { sendOfficialWhatsApp, sendUserWhatsApp } = require('./utils/whatsapp');

console.log('🧪 === TESTING WHATSAPP INTEGRATION ===\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('  ULTRAMSG_INSTANCE_ID:', process.env.ULTRAMSG_INSTANCE_ID ? '✅ SET' : '❌ NOT SET');
console.log('  ULTRAMSG_TOKEN:', process.env.ULTRAMSG_TOKEN ? '✅ SET' : '❌ NOT SET');
console.log('  BACKEND_URL:', process.env.BACKEND_URL || 'http://localhost:5000');
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:3000');
console.log('');

// Test complaint object
const testComplaint = {
  _id: '507f1f77bcf86cd799439011',
  location: 'Test Location - MG Road',
  category: 'roads',
  description: 'Test complaint for WhatsApp integration',
  userName: 'Test User'
};

const testOfficialNumber = '+919676227890'; // Change this to your test number
const testUserNumber = '+919676227890'; // Change this to your test number
const testSecurityToken = 'test_token_12345';

async function runTests() {
  try {
    console.log('🧪 Test 1: Sending WhatsApp to Official...');
    const officialResult = await sendOfficialWhatsApp(
      testComplaint,
      testOfficialNumber,
      testComplaint._id,
      testSecurityToken
    );
    console.log('📊 Official WhatsApp Result:', officialResult);
    console.log('');

    console.log('🧪 Test 2: Sending WhatsApp to User...');
    const userResult = await sendUserWhatsApp(
      testComplaint,
      testUserNumber,
      testComplaint._id
    );
    console.log('📊 User WhatsApp Result:', userResult);
    console.log('');

    console.log('🎯 === TEST COMPLETED ===');
    console.log('');
    console.log('📋 Summary:');
    console.log('  Official WhatsApp:', officialResult.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('  User WhatsApp:', userResult.success ? '✅ SUCCESS' : '❌ FAILED');
    
    if (!officialResult.success || !userResult.success) {
      console.log('');
      console.log('🔍 Troubleshooting Tips:');
      console.log('  1. Check if UltraMsg instance is connected to WhatsApp');
      console.log('  2. Log in to https://www.ultramsg.com/ and verify connection');
      console.log('  3. Check API usage limits');
      console.log('  4. Verify phone numbers have country code (e.g., +91...)');
      console.log('  5. Make sure WhatsApp Web is scanning QR code');
    }

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

runTests();
