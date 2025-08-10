/**
 * Get the actual order _id for the new session
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function getOrderId() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    
    const sessionId = 'cs_test_a1ynTEDMjcKSq73WiVtsG6ShUv1zkHJcqklHScMeSD4CvmUyrVbOw3ym9f';
    
    const orderDoc = await db.collection('orders').findOne({
      'orders.orderId': sessionId
    });
    
    if (orderDoc) {
      const order = orderDoc.orders.find(o => o.orderId === sessionId);
      console.log('Order _id:', order._id.toString());
      console.log('Order ID:', order.orderId);
      console.log('Status:', order.status);
      console.log('Invoice URL:', order.invoiceUrl ? 'Set' : 'Missing');
      console.log('Local Path:', order.localInvoicePath ? 'Set' : 'Missing');
      
      console.log('\nTest URLs:');
      console.log(`By _id: http://localhost:3001/api/invoice/${order._id}`);
      console.log(`By orderId: http://localhost:3001/api/invoice/${order.orderId}`);
    } else {
      console.log('Order not found');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

getOrderId();
