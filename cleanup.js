// MongoDB cleanup script
print('Before cleanup:', db.orders.countDocuments());

// Delete all documents with empty orders array
var result = db.orders.deleteMany({orders: {$size: 0}});
print('Deleted empty documents:', result.deletedCount);

print('After cleanup:', db.orders.countDocuments());

// Show remaining documents
print('\nRemaining documents:');
db.orders.find().forEach(doc => {
  print('User:', doc.userId, 'Orders:', doc.orders.length);
});
