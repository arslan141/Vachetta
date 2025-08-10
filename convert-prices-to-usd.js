require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Exchange rate: 1 USD = 83 INR (approximate current rate)
const INR_TO_USD_RATE = 83;

async function convertPricesToUSD() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Convert regular products
    console.log('💰 Converting regular product prices from INR to USD...');
    const products = await mongoose.connection.db.collection('products').find({}).toArray();
    
    for (const product of products) {
      const newPrice = Math.round((product.price / INR_TO_USD_RATE) * 100) / 100; // Round to 2 decimal places
      const newOriginalPrice = product.originalPrice ? Math.round((product.originalPrice / INR_TO_USD_RATE) * 100) / 100 : undefined;
      
      const updateData = { price: newPrice };
      if (newOriginalPrice) {
        updateData.originalPrice = newOriginalPrice;
      }
      
      await mongoose.connection.db.collection('products').updateOne(
        { _id: product._id },
        { $set: updateData }
      );
      
      console.log(`✅ ${product.name}: ₹${product.price} → $${newPrice}`);
    }

    // Convert leather products
    console.log('\n💎 Converting premium leather product prices...');
    const leatherProducts = await mongoose.connection.db.collection('leatherproducts').find({}).toArray();
    
    for (const product of leatherProducts) {
      const newPrice = Math.round((product.price / INR_TO_USD_RATE) * 100) / 100;
      
      await mongoose.connection.db.collection('leatherproducts').updateOne(
        { _id: product._id },
        { $set: { price: newPrice } }
      );
      
      console.log(`✅ ${product.name}: ₹${product.price} → $${newPrice}`);
    }

    console.log('\n🎉 Price conversion completed successfully!');
    console.log(`📊 Exchange rate used: 1 USD = ${INR_TO_USD_RATE} INR`);
    console.log('💡 Stripe will now display consistent USD prices');
    
  } catch (error) {
    console.error('❌ Error converting prices:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

convertPricesToUSD();
