/**
 * Test script to verify admin authentication
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// User Schema (simplified for testing)
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  emailVerified: Boolean,
  isActive: Boolean
}, {
  timestamps: true,
});

const User = mongoose.model('TestUser', UserSchema);

async function testAdminAuth() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@vachetta.com' });
    
    if (adminUser) {
      console.log('✅ Admin user found in database:');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Active: ${adminUser.isActive}`);
      console.log(`   Email Verified: ${adminUser.emailVerified}`);
      
      // Test password
      const testPassword = 'admin123';
      const passwordMatch = await bcrypt.compare(testPassword, adminUser.password);
      console.log(`   Password Test: ${passwordMatch ? '✅ PASS' : '❌ FAIL'}`);
      
      if (adminUser.role === 'admin') {
        console.log('\n🎉 Admin authentication should work!');
        console.log('🔗 Try logging in at: http://localhost:3001/login');
        console.log('📧 Email: admin@vachetta.com');
        console.log('🔑 Password: admin123');
        console.log('🏢 Then visit: http://localhost:3001/admin');
      } else {
        console.log('\n❌ User role is not admin');
      }
    } else {
      console.log('❌ Admin user not found in database');
    }

  } catch (error) {
    console.error('❌ Error testing admin auth:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

testAdminAuth();
