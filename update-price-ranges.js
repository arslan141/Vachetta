require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function updateToSpecifiedPriceRanges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Regular products: 500-3000 INR range
    const regularPriceUpdates = [
      { name: 'Classic Vachetta Tote Bag', price: 2799, originalPrice: 2999 },
      { name: 'Artisan Leather Wallet', price: 899, originalPrice: 1199 },
      { name: 'Vintage Messenger Bag', price: 1699, originalPrice: null },
      { name: 'Premium Leather Belt', price: 599, originalPrice: null },
      { name: 'Leather Card Holder', price: 499, originalPrice: null },
      { name: 'Executive Briefcase', price: 2999, originalPrice: null }
    ];

    // Premium products: 5000-10000 INR range
    const premiumPriceUpdates = [
      { name: 'Handcrafted Vachetta Satchel', price: 8999 },
      { name: 'Master Craftsman Wallet', price: 5499 },
      { name: 'Bespoke Leather Belt', price: 6999 }
    ];

    console.log('💰 Updating regular products to 500-3000 INR range...');
    for (const update of regularPriceUpdates) {
      const updateData = { price: update.price };
      if (update.originalPrice) {
        updateData.originalPrice = update.originalPrice;
      }
      
      const result = await mongoose.connection.db.collection('products').updateOne(
        { name: update.name },
        { $set: updateData }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✅ ${update.name}: ₹${update.price}`);
      } else {
        console.log(`⚠️  Product not found: ${update.name}`);
      }
    }

    console.log('\n💎 Updating premium products to 5000-10000 INR range...');
    for (const update of premiumPriceUpdates) {
      const result = await mongoose.connection.db.collection('leatherproducts').updateOne(
        { name: update.name },
        { $set: { price: update.price } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✅ ${update.name}: ₹${update.price}`);
      } else {
        console.log(`⚠️  Premium product not found: ${update.name}`);
      }
    }

    console.log('\n📊 Price Range Summary:');
    console.log('   💼 Regular Products: ₹500 - ₹3,000');
    console.log('   👑 Premium Products: ₹5,000 - ₹10,000');
    console.log('🎉 Price update completed successfully!');
    console.log('🇮🇳 All prices are optimized for Indian market');
    
  } catch (error) {
    console.error('❌ Error updating prices:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

updateToSpecifiedPriceRanges();
