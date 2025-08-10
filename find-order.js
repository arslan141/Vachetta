/**
 * Script to find the actual order ID for a Stripe session
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Orders Schema (simplified for testing)
const ProductSchema = new mongoose.Schema({
  productId: String,
  name: String,
  image: String,
  price: Number,
  quantity: Number,
}, { _id: true });

const OrderSchema = new mongoose.Schema({
  orderId: String,
  totalAmount: Number,
  currency: String,
  status: String,
  paymentIntentId: String,
  products: [ProductSchema],
  invoiceUrl: String,
  localInvoicePath: String,
  stripeSessionId: String, // Add this field
}, { timestamps: true, _id: true });

const UserOrdersSchema = new mongoose.Schema({
  userId: String,
  orders: [OrderSchema],
}, { timestamps: true });

const Orders = mongoose.model('TestOrders', UserOrdersSchema);

async function findOrderByStripeSession() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const stripeSessionId = 'cs_test_a1ReA4glOoIsbxTtxJhFIOvBggPr9u6B3GG4fVq2qRZQ7MQbOtksduUDIO';
    console.log('🔍 Looking for order with Stripe session:', stripeSessionId);

    // Find all orders documents
    const allOrderDocs = await Orders.find({});
    console.log(`📊 Found ${allOrderDocs.length} order documents`);

    // Find orders using the correct nested structure
    const orderDoc = await Orders.findOne({ 'orders.orderId': stripeSessionId });
    console.log(`� Found order document: ${!!orderDoc}`);
    
    if (orderDoc) {
      console.log(`� Order document belongs to user: ${orderDoc.userId}`);
      console.log(`📋 Document has ${orderDoc.orders.length} orders`);
      
      // Find the specific order
      const order = orderDoc.orders.find(o => 
        o.orderId === stripeSessionId || 
        o.paymentIntentId === stripeSessionId ||
        o._id.toString() === stripeSessionId
      );
      
      if (order) {
        foundOrder = order;
        foundUserId = orderDoc.userId;
        console.log(`🎯 FOUND MATCHING ORDER in nested structure!`);
      }
    } else {
      console.log('❌ No order document found with nested search');
    }

    if (foundOrder) {
      console.log('\n✅ Order found:');
      console.log(`   User ID: ${foundUserId}`);
      console.log(`   Order _id: ${foundOrder._id}`);
      console.log(`   Order ID: ${foundOrder.orderId}`);
      console.log(`   Payment Intent: ${foundOrder.paymentIntentId}`);
      console.log(`   Status: ${foundOrder.status}`);
      console.log(`   Invoice URL: ${foundOrder.invoiceUrl ? 'Yes' : 'No'}`);
      console.log(`   Local Path: ${foundOrder.localInvoicePath ? 'Yes' : 'No'}`);
      
      console.log('\n🔗 Test URLs:');
      console.log(`   By _id: http://localhost:3001/api/invoice/${foundOrder._id}`);
      console.log(`   By orderId: http://localhost:3001/api/invoice/${foundOrder.orderId}`);
    } else {
      console.log('\n❌ No order found matching the Stripe session ID');
      console.log('\n💡 Available orders:');
      
      for (const doc of allOrderDocs) {
        for (const order of doc.orders) {
          console.log(`   📄 User ${doc.userId}: ${order._id} (${order.orderId})`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

findOrderByStripeSession();
