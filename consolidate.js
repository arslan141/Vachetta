// MongoDB consolidation script
var userId = '6897b143d3f2e622d3bea2b2';
print('Consolidating orders for user:', userId);

// Find all documents for this user
var docs = db.orders.find({userId: userId}).toArray();
print('Found documents:', docs.length);

// Collect all orders
var allOrders = [];
docs.forEach(doc => {
  allOrders = allOrders.concat(doc.orders);
});

print('Total orders to consolidate:', allOrders.length);

// Remove duplicates based on orderId
var uniqueOrders = [];
var seenOrderIds = new Set();

allOrders.forEach(order => {
  if (!seenOrderIds.has(order.orderId)) {
    uniqueOrders.push(order);
    seenOrderIds.add(order.orderId);
  }
});

print('Unique orders after deduplication:', uniqueOrders.length);

// Delete all existing documents for this user
var deleteResult = db.orders.deleteMany({userId: userId});
print('Deleted existing documents:', deleteResult.deletedCount);

// Create single consolidated document
if (uniqueOrders.length > 0) {
  var newDoc = db.orders.insertOne({
    userId: userId,
    orders: uniqueOrders,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  print('Created consolidated document:', newDoc.insertedId);
} else {
  print('No orders to consolidate');
}

// Verify final state
print('\nFinal verification:');
var finalDocs = db.orders.find({userId: userId}).toArray();
finalDocs.forEach(doc => {
  print('Document', doc._id, 'has', doc.orders.length, 'orders');
  doc.orders.forEach(order => {
    print('  - Order:', order.orderId, 'Status:', order.status);
  });
});
