/**
 * Test script to manually create an order and verify database operations
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Replicate the exact Orders schema
const ProductsSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: false,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: false,
  },
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

const Orders = mongoose.model('TestOrders', UserOrdersSchema);

async function testOrderCreation() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('🔌 Connecting to MongoDB...');
    console.log('MongoDB URI:', MONGODB_URI ? 'Found' : 'Missing');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test creating an order for the user from Stripe metadata
    const userId = '6897b143d3f2e622d3bea2b2';
    const sessionId = 'cs_test_a1ReA4glOoIsbxTtxJhFIOvBggPr9u6B3GG4fVq2qRZQ7MQbOtksduUDIO';

    console.log('🧪 Testing order creation...');

    // Check if user orders document exists
    let orderDoc = await Orders.findOne({ userId });
    console.log(`📋 Existing order document: ${!!orderDoc}`);

    if (!orderDoc) {
      console.log('➕ Creating new order document...');
      orderDoc = await Orders.create({ userId, orders: [] });
      console.log('✅ Created order document:', orderDoc._id);
    }

    // Create a test order
    const testOrder = {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '1234567890',
      address: {
        city: 'Test City',
        country: 'US',
        line1: '123 Test St',
        line2: '',
        postal_code: '12345',
        state: 'CA'
      },
      products: [{
        productId: 'prod_Sq1RrZkEW11xqH',
        color: 'brown',
        size: 'standard',
        quantity: 1
      }],
      orderId: sessionId,
      paymentIntentId: 'pi_3RuUaRIxHO9aj39B00mfKuX1',
      total_price: 10619,
      status: 'pending',
      invoiceUrl: 'https://example.com/invoice.pdf',
      localInvoicePath: `invoice-${sessionId}.pdf`
    };

    console.log('📝 Adding order to document...');
    orderDoc.orders.push(testOrder);
    
    console.log('💾 Saving to database...');
    const saved = await orderDoc.save();
    console.log('✅ Order saved successfully!');
    console.log(`   Document ID: ${saved._id}`);
    console.log(`   Orders count: ${saved.orders.length}`);
    console.log(`   Last order ID: ${saved.orders[saved.orders.length - 1].orderId}`);

    // Verify by querying
    console.log('🔍 Verifying by querying...');
    const found = await Orders.findOne({ 'orders.orderId': sessionId });
    if (found) {
      const order = found.orders.find(o => o.orderId === sessionId);
      console.log('✅ Order found in database!');
      console.log(`   Order _id: ${order._id}`);
      console.log(`   Order ID: ${order.orderId}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Invoice URL: ${order.invoiceUrl}`);
    } else {
      console.log('❌ Order not found after save');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testOrderCreation();
