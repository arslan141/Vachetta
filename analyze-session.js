/**
 * Analyze the new failing session ID
 * Session: cs_test_a1ynTEDMjcKSq73WiVtsG6ShUv1zkHJcqklHScMeSD4CvmUyrVbOw3ym9f
 */

require('dotenv').config({ path: '.env.local' });

async function analyzeNewSession() {
  try {
    console.log('🔍 ANALYZING NEW SESSION FAILURE');
    console.log('=' .repeat(60));
    
    const sessionId = 'cs_test_a1ynTEDMjcKSq73WiVtsG6ShUv1zkHJcqklHScMeSD4CvmUyrVbOw3ym9f';
    console.log(`Session ID: ${sessionId}`);
    console.log(`URL: http://localhost:3000/api/invoice/${sessionId}`);
    
    // 1. Check if this session exists in Stripe
    console.log('\n1️⃣ Stripe Session Analysis:');
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.log('❌ No Stripe secret key found');
      return;
    }

    const stripe = require('stripe')(stripeSecretKey);
    
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, { 
        expand: ['line_items', 'payment_intent', 'invoice'] 
      });
      
      console.log('✅ Session found in Stripe:');
      console.log(`   Payment Status: ${session.payment_status}`);
      console.log(`   Customer Email: ${session.customer_details?.email || 'N/A'}`);
      console.log(`   Customer Name: ${session.customer_details?.name || 'N/A'}`);
      console.log(`   Amount: ${session.amount_total} ${session.currency}`);
      console.log(`   Created: ${new Date(session.created * 1000).toISOString()}`);
      
      console.log('\n📋 Metadata:');
      if (session.metadata && Object.keys(session.metadata).length > 0) {
        Object.entries(session.metadata).forEach(([key, value]) => {
          console.log(`   ${key}: ${value}`);
        });
      } else {
        console.log('   ❌ No metadata found');
      }

      console.log('\n💳 Payment Intent:');
      if (session.payment_intent) {
        const pi = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id;
        console.log(`   ID: ${pi}`);
        if (typeof session.payment_intent === 'object') {
          console.log(`   Status: ${session.payment_intent.status}`);
          console.log(`   Invoice: ${session.payment_intent.invoice || 'None'}`);
        }
      } else {
        console.log('   ❌ No payment intent');
      }

      console.log('\n📄 Invoice Status:');
      if (session.invoice) {
        const invoiceId = typeof session.invoice === 'string' ? session.invoice : session.invoice.id;
        console.log(`   Invoice ID: ${invoiceId}`);
        
        try {
          const invoice = await stripe.invoices.retrieve(invoiceId);
          console.log(`   Status: ${invoice.status}`);
          console.log(`   Hosted URL: ${invoice.hosted_invoice_url ? 'Available' : 'None'}`);
          console.log(`   PDF: ${invoice.invoice_pdf ? 'Available' : 'None'}`);
        } catch (invError) {
          console.log(`   ❌ Error retrieving invoice: ${invError.message}`);
        }
      } else {
        console.log('   ❌ No invoice attached to session');
      }

    } catch (stripeError) {
      console.log(`❌ Session not found in Stripe: ${stripeError.message}`);
      if (stripeError.code === 'resource_missing') {
        console.log('   This session may be expired, deleted, or from a different account');
      }
    }

    // 2. Check MongoDB for this session
    console.log('\n2️⃣ MongoDB Analysis:');
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Check if order exists
    const orderDoc = await db.collection('orders').findOne({
      'orders.orderId': sessionId
    });
    
    if (orderDoc) {
      const order = orderDoc.orders.find(o => o.orderId === sessionId);
      console.log('✅ Order found in database:');
      console.log(`   User ID: ${orderDoc.userId}`);
      console.log(`   Order Status: ${order.status}`);
      console.log(`   Payment Intent: ${order.paymentIntentId}`);
      console.log(`   Invoice URL: ${order.invoiceUrl ? 'Set' : 'Missing'}`);
      console.log(`   Local Path: ${order.localInvoicePath ? 'Set' : 'Missing'}`);
    } else {
      console.log('❌ Order not found in database');
      
      // Check all sessions in database
      console.log('\n📊 Available sessions in database:');
      const allOrders = await db.collection('orders').find({}).toArray();
      let totalOrders = 0;
      
      for (const doc of allOrders) {
        for (const order of doc.orders) {
          totalOrders++;
          if (totalOrders <= 10) { // Show first 10
            console.log(`   ${order.orderId} (${order.status})`);
          }
        }
      }
      
      if (totalOrders > 10) {
        console.log(`   ... and ${totalOrders - 10} more orders`);
      }
    }

    await mongoose.disconnect();

  } catch (error) {
    console.error('\n❌ Analysis failed:', error.message);
  }
}

analyzeNewSession();
