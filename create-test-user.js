/**
 * Create a test user for authentication
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  emailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('TestUser', UserSchema);

async function createTestUser() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create the user from Stripe metadata
    const userId = '6897b143d3f2e622d3bea2b2';
    const userEmail = 'arslanahmad713@gmail.com'; // From Stripe session
    const userName = 'zsdd'; // From Stripe session

    console.log('🧪 Creating test user...');

    // Check if user exists
    let user = await User.findById(userId);
    if (user) {
      console.log('✅ User already exists:', user.email);
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash('testpassword123', 10);
      
      // Create user with specific _id
      user = new User({
        _id: userId,
        email: userEmail,
        password: hashedPassword,
        name: userName,
        role: 'user',
        emailVerified: true,
        isActive: true
      });

      await user.save();
      console.log('✅ User created successfully!');
      console.log(`   ID: ${user._id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log('🔑 Password: testpassword123');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createTestUser();
