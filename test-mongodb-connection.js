require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const testConnection = async () => {
  console.log('🔗 Testing MongoDB connection...');
  console.log('MongoDB URI:', process.env.MONGODB_URI);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test querying users collection
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    console.log(`📊 Found ${users.length} users in database`);
    
    // Test querying products collection
    const products = await db.collection('products').find({}).toArray();
    console.log(`📦 Found ${products.length} products in database`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
