// MongoDB initialization script for Vachetta e-commerce
// This script sets up the initial database structure and admin user

print('🚀 Initializing Vachetta e-commerce database...');

// Switch to the application database
db = db.getSiblingDB('vachetta-ecom');

print('📊 Setting up database: vachetta-ecom');

// Create admin user if it doesn't exist
const adminUser = {
  _id: ObjectId(),
  email: 'admin@vachetta.com',
  password: '$2a$12$FCEUfG0V5TlYxro19fVK2e6PApIABrIo9NlMwlzAFm673.qAMTI3q', // admin123
  name: 'Vachetta Admin',
  phone: '',
  role: 'admin',
  preferences: {
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false
  },
  emailVerified: true,
  isActive: true,
  shippingAddresses: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0
};

// Check if admin user already exists
const existingAdmin = db.users.findOne({ email: 'admin@vachetta.com' });
if (!existingAdmin) {
  db.users.insertOne(adminUser);
  print('✅ Created admin user: admin@vachetta.com (password: admin123)');
} else {
  print('✅ Admin user already exists');
}

// Create indexes for better performance
print('📈 Creating database indexes...');

// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Order indexes
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ "orders.orderId": 1 });
db.orders.createIndex({ "orders.paymentIntentId": 1 });
db.orders.createIndex({ "orders.status": 1 });

// Product indexes (if using products collection)
db.products.createIndex({ category: 1 });
db.products.createIndex({ name: "text", description: "text" });

print('✅ Database initialization complete!');
print('🔗 Connect to: mongodb://localhost:27017/vachetta-ecom');
print('👤 Admin user: admin@vachetta.com / admin123');
