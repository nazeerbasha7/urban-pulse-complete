// WhatsApp Diagnostic Script - Find why messages aren't arriving
require('dotenv').config();
const axios = require('axios');

console.log('\n🔍 === WHATSAPP DIAGNOSTIC CHECK ===\n');

const INSTANCE_ID = process.env.ULTRAMSG_INSTANCE_ID;
const TOKEN = process.env.ULTRAMSG_TOKEN;

async function checkUltraMsgStatus() {
  try {
    console.log('1️⃣ CHECKING ULTRAMSG CONNECTION STATUS\n');
    
    // Check instance status
    const statusUrl = `https://api.ultramsg.com/${INSTANCE_ID}/instance/status`;
    console.log('🌐 Checking:', statusUrl);
    
    const response = await axios.get(statusUrl, {
      params: { token: TOKEN }
    });
    
    console.log('\n📊 Instance Status Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.accountStatus === 'authenticated') {
      console.log('\n✅ WhatsApp is CONNECTED and authenticated');
    } else {
      console.log('\n❌ WhatsApp is NOT connected!');
      console.log('⚠️ Status:', response.data.accountStatus);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error checking status:', error.response?.data || error.message);
  }
}

async function checkMessageQueue() {
  try {
    console.log('2️⃣ CHECKING MESSAGE QUEUE\n');
    
    const queueUrl = `https://api.ultramsg.com/${INSTANCE_ID}/messages/queue`;
    console.log('🌐 Checking queue:', queueUrl);
    
    const response = await axios.get(queueUrl, {
      params: { token: TOKEN }
    });
    
    console.log('\n📊 Queue Status:');
    console.log(JSON.stringify(response.data, null, 2));
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error checking queue:', error.response?.data || error.message);
  }
}

async function testActualMessage() {
  try {
    console.log('3️⃣ SENDING TEST MESSAGE TO YOUR NUMBER\n');
    
    const testNumber = '+919652297185'; // Your Guntur number
    const testMessage = `🧪 TEST MESSAGE from UrbanPulse

This is a test to verify WhatsApp delivery.

Time: ${new Date().toLocaleString()}

If you receive this, WhatsApp is working! ✅`;

    console.log(`📱 Sending to: ${testNumber}`);
    
    const url = `https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`;
    const response = await axios.post(url, {
      token: TOKEN,
      to: testNumber.replace(/\D/g, ''),
      body: testMessage
    });
    
    console.log('\n📊 Send Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.sent === 'true' || response.data.sent === true) {
      console.log('\n✅ Message sent successfully!');
      console.log('📱 Check your WhatsApp: +919652297185');
      console.log('⏰ Wait 5-10 seconds for message to arrive');
    } else {
      console.log('\n❌ Message failed to send!');
      console.log('Response:', response.data);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error sending message:', error.response?.data || error.message);
  }
}

async function runDiagnostics() {
  console.log('🔧 Running comprehensive WhatsApp diagnostics...\n');
  console.log('Instance ID:', INSTANCE_ID);
  console.log('Token:', TOKEN ? '***SET***' : '❌ NOT SET');
  console.log('\n═'.repeat(50));
  console.log('\n');
  
  await checkUltraMsgStatus();
  await checkMessageQueue();
  await testActualMessage();
  
  console.log('\n═'.repeat(50));
  console.log('\n📋 POSSIBLE REASONS WHY YOU\'RE NOT GETTING MESSAGES:\n');
  console.log('1️⃣  WhatsApp Web Session Disconnected');
  console.log('   → Go to https://ultramsg.com');
  console.log('   → Check if status shows "Connected" (green)');
  console.log('   → If not, scan QR code again\n');
  
  console.log('2️⃣  Phone Number Not on WhatsApp');
  console.log('   → Verify +919652297185 has WhatsApp installed');
  console.log('   → Number must be active on WhatsApp\n');
  
  console.log('3️⃣  API Quota Exceeded');
  console.log('   → Free tier: 100 messages/month');
  console.log('   → Check usage in UltraMsg dashboard\n');
  
  console.log('4️⃣  Messages in Queue/Pending');
  console.log('   → Messages might be queued');
  console.log('   → Check "Messages" tab in UltraMsg dashboard\n');
  
  console.log('5️⃣  Wrong Instance Connected');
  console.log('   → Verify instance146869 is the active one');
  console.log('   → Only one instance can be active at a time\n');
  
  console.log('6️⃣  WhatsApp Number Blocked');
  console.log('   → UltraMsg number might be blocked on recipient phone');
  console.log('   → Check WhatsApp blocked contacts\n');
  
  console.log('\n🔍 IMMEDIATE ACTION:\n');
  console.log('1. Open: https://ultramsg.com/');
  console.log('2. Login to your account');
  console.log('3. Click "instance146869"');
  console.log('4. Check STATUS - must be 🟢 CONNECTED');
  console.log('5. Click "Messages" tab to see delivery status');
  console.log('6. If disconnected, click "Connect" and scan QR\n');
  
  console.log('═'.repeat(50));
  console.log('\n');
}

runDiagnostics();
