/**
 * Test script to check Stripe session details
 */

require('dotenv').config({ path: '.env.local' });

async function checkStripeSession() {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.log('❌ No STRIPE_SECRET_KEY found in environment');
      return;
    }

    const stripe = require('stripe')(stripeSecretKey);
    const sessionId = 'cs_test_a1ReA4glOoIsbxTtxJhFIOvBggPr9u6B3GG4fVq2qRZQ7MQbOtksduUDIO';

    console.log('🔍 Retrieving session from Stripe...');
    const session = await stripe.checkout.sessions.retrieve(sessionId, { 
      expand: ['line_items', 'payment_intent', 'invoice'] 
    });

    console.log('\n📊 Session Details:');
    console.log(`   ID: ${session.id}`);
    console.log(`   Payment Status: ${session.payment_status}`);
    console.log(`   Customer Email: ${session.customer_details?.email}`);
    console.log(`   Customer Name: ${session.customer_details?.name}`);
    console.log(`   Amount Total: ${session.amount_total}`);
    console.log(`   Currency: ${session.currency}`);
    
    console.log('\n🏷️ Metadata:');
    if (session.metadata && Object.keys(session.metadata).length > 0) {
      Object.entries(session.metadata).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    } else {
      console.log('   No metadata found');
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
      console.log('   No payment intent');
    }

    console.log('\n📄 Invoice:');
    if (session.invoice) {
      const invoiceId = typeof session.invoice === 'string' ? session.invoice : session.invoice.id;
      console.log(`   ID: ${invoiceId}`);
      
      // Get invoice details
      const invoice = await stripe.invoices.retrieve(invoiceId);
      console.log(`   Status: ${invoice.status}`);
      console.log(`   Hosted URL: ${invoice.hosted_invoice_url ? 'Available' : 'None'}`);
      console.log(`   PDF: ${invoice.invoice_pdf ? 'Available' : 'None'}`);
    } else {
      console.log('   No invoice attached to session');
    }

    console.log('\n🛒 Line Items:');
    if (session.line_items?.data) {
      session.line_items.data.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.description || 'Item'} - Qty: ${item.quantity}, Price: ${item.price?.unit_amount}`);
        console.log(`      Product ID: ${item.price?.product}`);
      });
    } else {
      console.log('   No line items found');
    }

  } catch (error) {
    console.error('❌ Error checking Stripe session:', error.message);
  }
}

checkStripeSession();
