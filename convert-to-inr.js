require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function updatePricesToINR() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Convert prices to proper INR amounts (multiply by ~80 for realistic INR pricing)
    const INR_MULTIPLIER = 80;

    console.log('💰 Converting product prices to proper INR amounts...');
    const products = await mongoose.connection.db.collection('products').find({}).toArray();
    
    for (const product of products) {
      const newPrice = Math.round(product.price * INR_MULTIPLIER);
      const newOriginalPrice = product.originalPrice ? Math.round(product.originalPrice * INR_MULTIPLIER) : undefined;
      
      const updateData = { price: newPrice };
      if (newOriginalPrice) {
        updateData.originalPrice = newOriginalPrice;
      }
      
      await mongoose.connection.db.collection('products').updateOne(
        { _id: product._id },
        { $set: updateData }
      );
      
      console.log(`✅ ${product.name}: $${product.price} → ₹${newPrice}`);
    }

    console.log('\n💎 Converting premium leather product prices...');
    const leatherProducts = await mongoose.connection.db.collection('leatherproducts').find({}).toArray();
    
    for (const product of leatherProducts) {
      const newPrice = Math.round(product.price * INR_MULTIPLIER);
      
      await mongoose.connection.db.collection('leatherproducts').updateOne(
        { _id: product._id },
        { $set: { price: newPrice } }
      );
      
      console.log(`✅ ${product.name}: $${product.price} → ₹${newPrice}`);
    }

    console.log('\n🎉 Price conversion to INR completed successfully!');
    console.log('🇮🇳 All prices are now in Indian Rupees');
    console.log('💳 Stripe will process payments in INR');
    
  } catch (error) {
    console.error('❌ Error converting prices:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

updatePricesToINR();
