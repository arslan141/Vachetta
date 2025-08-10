/**
 * Clean up duplicate empty order documents
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Replicate the exact Orders schema
const ProductsSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  color: { type: String, required: false },
  size: { type: String, required: true },
  quantity: { type: Number, required: false },
});

const AddressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String, required: false },
  postal_code: { type: String, required: true },
  state: { type: String, required: false },
});

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  address: AddressSchema,
  products: [ProductsSchema],
  orderId: { type: String, required: true },
  paymentIntentId: { type: String, required: false },
  total_price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  tracking_code: { type: String, required: false },
  estimated_delivery_date: { type: Date, required: false },
  invoiceUrl: { type: String, required: false },
  localInvoicePath: { type: String, required: false },
}, { timestamps: true, _id: true });

const UserOrdersSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orders: [OrderSchema],
}, { timestamps: true });

const Orders = mongoose.model('CleanupOrders', UserOrdersSchema);

async function cleanupDuplicateOrders() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const userId = '6897b143d3f2e622d3bea2b2';
    console.log('🧹 Cleaning up duplicate orders for user:', userId);

    // Find all order documents for this user
    const allDocs = await Orders.find({ userId });
    console.log(`📊 Found ${allDocs.length} order documents for user`);

    // Separate empty and non-empty documents
    const emptyDocs = allDocs.filter(doc => doc.orders.length === 0);
    const nonEmptyDocs = allDocs.filter(doc => doc.orders.length > 0);

    console.log(`📋 Empty documents: ${emptyDocs.length}`);
    console.log(`📋 Non-empty documents: ${nonEmptyDocs.length}`);

    if (emptyDocs.length > 0) {
      console.log('🗑️ Deleting empty order documents...');
      const deleteResult = await Orders.deleteMany({ 
        userId,
        orders: { $size: 0 }
      });
      console.log(`✅ Deleted ${deleteResult.deletedCount} empty documents`);
    }

    // Consolidate non-empty documents if there are multiple
    if (nonEmptyDocs.length > 1) {
      console.log('🔄 Consolidating multiple non-empty documents...');
      
      // Collect all orders from all documents
      const allOrders = [];
      for (const doc of nonEmptyDocs) {
        allOrders.push(...doc.orders);
      }

      console.log(`📦 Total orders to consolidate: ${allOrders.length}`);

      // Delete all existing documents for this user
      await Orders.deleteMany({ userId });

      // Create a single consolidated document
      const consolidatedDoc = await Orders.create({
        userId,
        orders: allOrders
      });

      console.log(`✅ Created consolidated document with ${consolidatedDoc.orders.length} orders`);
    }

    // Final verification
    const finalDocs = await Orders.find({ userId });
    console.log(`\n📊 Final state:`);
    console.log(`   Documents for user: ${finalDocs.length}`);
    for (const doc of finalDocs) {
      console.log(`   Document ${doc._id}: ${doc.orders.length} orders`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

cleanupDuplicateOrders();
