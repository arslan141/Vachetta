/**
 * Check if user exists in database
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
  // ... other fields
}, { timestamps: true });

const User = mongoose.model('TestUser', UserSchema);

async function checkUser() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const userId = '6897b143d3f2e622d3bea2b2';
    console.log('🔍 Looking for user:', userId);

    const user = await User.findById(userId);
    if (user) {
      console.log('✅ User found:');
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
    } else {
      console.log('❌ User not found');
      
      // Let's see what users exist
      console.log('\n📊 Available users:');
      const allUsers = await User.find({}).limit(5);
      allUsers.forEach(u => {
        console.log(`   ${u._id} - ${u.email} (${u.name})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkUser();
