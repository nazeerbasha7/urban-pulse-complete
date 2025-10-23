// Quick script to view all complaints from database
require('dotenv').config();
const mongoose = require('mongoose');
const Complaint = require('./models/Complaint');

const MONGO_URI = process.env.MONGO_URI;

console.log('🔍 Fetching complaints from database...\n');

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const complaints = await Complaint.find().sort({ submittedAt: -1 }).limit(10);
    
    console.log(`📊 Total Complaints Found: ${complaints.length}\n`);
    console.log('═'.repeat(80));
    
    if (complaints.length === 0) {
      console.log('\n❌ No complaints found in database!\n');
      console.log('Possible reasons:');
      console.log('  1. Complaint submission failed');
      console.log('  2. Backend was not running when you submitted');
      console.log('  3. Frontend is pointing to wrong API URL');
      console.log('');
    } else {
      complaints.forEach((complaint, index) => {
        console.log(`\n📋 Complaint #${index + 1}`);
        console.log('─'.repeat(80));
        console.log(`ID:           ${complaint._id}`);
        console.log(`User:         ${complaint.userName}`);
        console.log(`City:         ${complaint.city || 'N/A'}`);
        console.log(`Category:     ${complaint.category}`);
        console.log(`Location:     ${complaint.location}`);
        console.log(`Description:  ${complaint.description.substring(0, 100)}${complaint.description.length > 100 ? '...' : ''}`);
        console.log(`Status:       ${complaint.status}`);
        console.log(`Department:   ${complaint.department || 'N/A'}`);
        console.log(`Contact:      ${complaint.departmentContact || 'N/A'}`);
        console.log(`Submitted:    ${complaint.submittedAt}`);
        console.log(`Updated:      ${complaint.updatedAt}`);
        if (complaint.images && complaint.images.length > 0) {
          console.log(`Images:       ${complaint.images.length} file(s)`);
        }
        console.log('═'.repeat(80));
      });
      
      console.log('\n✅ All complaints displayed successfully!\n');
      console.log('💡 To view in frontend:');
      console.log('   - Dashboard: urbanpulse-frontend/dashboard.html');
      console.log('   - All Complaints: urbanpulse-frontend/complaints.html');
      console.log('');
    }
    
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed\n');
    process.exit(0);
    
  })
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
