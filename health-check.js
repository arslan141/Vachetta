/**
 * Database Health Check Script
 * Verifies Docker + MongoDB integration with the Next.js app
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkDatabaseHealth() {
  try {
    console.log('🔍 VACHETTA DATABASE HEALTH CHECK');
    console.log('=' .repeat(50));
    
    // 1. Check environment variables
    console.log('\n1️⃣ Environment Variables:');
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log(`   MONGODB_URI: ${MONGODB_URI ? '✅ Found' : '❌ Missing'}`);
    console.log(`   STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✅ Found' : '❌ Missing'}`);
    console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Found' : '❌ Missing'}`);

    if (!MONGODB_URI) {
      console.log('❌ MongoDB URI is missing. Check your .env.local file.');
      return;
    }

    // 2. Check MongoDB connection
    console.log('\n2️⃣ MongoDB Connection:');
    console.log(`   Connecting to: ${MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('   ✅ Connected successfully');

    // 3. Check database and collections
    console.log('\n3️⃣ Database Structure:');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`   Database: ${db.databaseName}`);
    console.log(`   Collections: ${collections.length}`);
    
    const expectedCollections = ['users', 'orders'];
    for (const collName of expectedCollections) {
      const exists = collections.find(c => c.name === collName);
      console.log(`   - ${collName}: ${exists ? '✅ Exists' : '⚠️ Missing'}`);
    }

    // 4. Check user data
    console.log('\n4️⃣ User Data:');
    const userCount = await db.collection('users').countDocuments();
    console.log(`   Total users: ${userCount}`);
    
    const adminUser = await db.collection('users').findOne({ role: 'admin' });
    console.log(`   Admin user: ${adminUser ? '✅ Found' : '❌ Missing'}`);
    if (adminUser) {
      console.log(`     Email: ${adminUser.email}`);
      console.log(`     Active: ${adminUser.isActive}`);
    }

    // 5. Check order data
    console.log('\n5️⃣ Order Data:');
    const orderDocs = await db.collection('orders').countDocuments();
    console.log(`   Order documents: ${orderDocs}`);
    
    const ordersWithData = await db.collection('orders').countDocuments({ 
      orders: { $ne: [] } 
    });
    console.log(`   Documents with orders: ${ordersWithData}`);
    
    const emptyDocs = await db.collection('orders').countDocuments({ 
      orders: { $size: 0 } 
    });
    console.log(`   Empty documents: ${emptyDocs}`);

    if (emptyDocs > 0) {
      console.log('   ⚠️ Empty order documents found - consider cleanup');
    }

    // 6. Check specific test order
    console.log('\n6️⃣ Test Order Status:');
    const testSessionId = 'cs_test_a1ReA4glOoIsbxTtxJhFIOvBggPr9u6B3GG4fVq2qRZQ7MQbOtksduUDIO';
    const testOrder = await db.collection('orders').findOne({
      'orders.orderId': testSessionId
    });
    
    if (testOrder) {
      const order = testOrder.orders.find(o => o.orderId === testSessionId);
      console.log(`   Test order: ✅ Found`);
      console.log(`     Order ID: ${order.orderId}`);
      console.log(`     Status: ${order.status}`);
      console.log(`     Invoice URL: ${order.invoiceUrl ? '✅ Set' : '❌ Missing'}`);
      console.log(`     Local Path: ${order.localInvoicePath ? '✅ Set' : '❌ Missing'}`);
    } else {
      console.log(`   Test order: ❌ Not found`);
    }

    // 7. Performance checks
    console.log('\n7️⃣ Performance Metrics:');
    const stats = await db.stats();
    console.log(`   Database size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Index size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Collections: ${stats.collections}`);

    // 8. Index health
    console.log('\n8️⃣ Index Health:');
    const userIndexes = await db.collection('users').indexes();
    const orderIndexes = await db.collection('orders').indexes();
    
    console.log(`   User indexes: ${userIndexes.length}`);
    console.log(`   Order indexes: ${orderIndexes.length}`);

    // 9. Docker integration check
    console.log('\n9️⃣ Docker Integration:');
    const isDockerized = process.env.MONGODB_URI?.includes('localhost:27017');
    console.log(`   Using Docker MongoDB: ${isDockerized ? '✅ Yes' : '⚠️ External DB'}`);

    console.log('\n✅ HEALTH CHECK COMPLETE');
    console.log('=' .repeat(50));

  } catch (error) {
    console.error('\n❌ HEALTH CHECK FAILED:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check if MongoDB Docker container is running: docker ps');
      console.log('   - Start MongoDB: docker-compose up -d mongodb');
      console.log('   - Check container logs: docker logs vachetta-mongodb');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkDatabaseHealth();
