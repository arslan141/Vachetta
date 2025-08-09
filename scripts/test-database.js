require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Product Schema (simplified version for testing)
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: [String],
  variants: Array,
  isActive: Boolean,
  stock: Number,
  createdAt: Date
});

const Product = mongoose.model('Product', productSchema);

async function testDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database');

    // Test: Get all products
    console.log('\n📦 Testing product retrieval...');
    const allProducts = await Product.find({});
    console.log(`✅ Found ${allProducts.length} total products`);

    // Test: Get products by category
    const categories = ['bags', 'wallets', 'belts', 'accessories'];
    for (const category of categories) {
      const categoryProducts = await Product.find({ category });
      console.log(`   ${category}: ${categoryProducts.length} products`);
    }

    // Test: Show first few product names
    console.log('\n🏷️  Sample products:');
    const sampleProducts = await Product.find({}).limit(5);
    sampleProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });

    console.log('\n✅ Database test completed successfully!');
    console.log('🌐 Your application should now show products at:');
    console.log('   Home: http://localhost:3000');
    console.log('   Bags: http://localhost:3000/bags');
    console.log('   Wallets: http://localhost:3000/wallets');
    console.log('   Belts: http://localhost:3000/belts');
    console.log('   Accessories: http://localhost:3000/accessories');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

testDatabase();
