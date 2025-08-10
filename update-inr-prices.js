require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function updateToReasonableINR() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Reasonable INR price mapping for leather products
    const priceUpdates = [
      { name: 'Classic Vachetta Tote Bag', price: 23999, originalPrice: 28999 },
      { name: 'Artisan Leather Wallet', price: 7999, originalPrice: 9999 },
      { name: 'Vintage Messenger Bag', price: 16999 },
      { name: 'Premium Leather Belt', price: 5999 },
      { name: 'Leather Card Holder', price: 3999 },
      { name: 'Executive Briefcase', price: 36999 }
    ];

    const premiumPriceUpdates = [
      { name: 'Handcrafted Vachetta Satchel', price: 49999 },
      { name: 'Master Craftsman Wallet', price: 15999 },
      { name: 'Bespoke Leather Belt', price: 12999 }
    ];

    console.log('💰 Updating regular products to reasonable INR prices...');
    for (const update of priceUpdates) {
      const updateData = { price: update.price };
      if (update.originalPrice) {
        updateData.originalPrice = update.originalPrice;
      }
      
      await mongoose.connection.db.collection('products').updateOne(
        { name: update.name },
        { $set: updateData }
      );
      
      console.log(`✅ ${update.name}: ₹${update.price}`);
    }

    console.log('\n💎 Updating premium products to reasonable INR prices...');
    for (const update of premiumPriceUpdates) {
      await mongoose.connection.db.collection('leatherproducts').updateOne(
        { name: update.name },
        { $set: { price: update.price } }
      );
      
      console.log(`✅ ${update.name}: ₹${update.price}`);
    }

    console.log('\n🎉 INR price update completed successfully!');
    console.log('🇮🇳 All prices are now in reasonable Indian Rupees');
    console.log('💳 Stripe will process payments in INR currency');
    
  } catch (error) {
    console.error('❌ Error updating prices:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

updateToReasonableINR();
