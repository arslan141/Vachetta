/**
 * RBAC Admin User Seeding Script (Legacy JavaScript Version)
 * Creates an admin user with role-based access control
 * Uses unified database approach (no separate admin database)
 * 
 * Usage: node scripts/seed-admin.js
 * 
 * Note: Prefer using the TypeScript version: npm run seed-admin
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// User Schema (simplified version for seeding)
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);

async function seedAdminUser() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('Please ensure your .env.local file contains:');
      console.log('MONGODB_URI="mongodb://localhost:27017/ecommerce-template"');
      process.exit(1);
    }

    console.log('🔌 Connecting to main application database (RBAC)...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to vachetta-db database (unified RBAC)');

    // RBAC Admin user details
    const adminEmail = 'admin@vachetta.com';
    const adminPassword = 'admin123';
    const adminName = 'Vachetta Admin';

    // Check if RBAC admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('⚠️  RBAC admin user already exists:', adminEmail);
      
      // Ensure user has admin role (RBAC enforcement)
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role (RBAC)');
      }
      
      console.log('👤 RBAC Admin user details:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Role: ${existingAdmin.role} (RBAC-enabled)`);
      console.log(`   Database: vachetta-db (unified)`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
    } else {
      // Hash the password
      console.log('🔐 Hashing password...');
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      // Create RBAC admin user
      console.log('👤 Creating RBAC admin user...');
      const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'admin', // RBAC role assignment
        emailVerified: true, // Admin user is pre-verified
        isActive: true
      });

      await adminUser.save();
      console.log('✅ RBAC admin user created successfully!');
      console.log('👤 RBAC Admin user details:');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Role: ${adminUser.role} (RBAC-enabled)`);
      console.log(`   Database: vachetta-db (unified)`);
      console.log(`   Auto-redirect: /admin (RBAC routing)`);
      console.log(`   Created: ${adminUser.createdAt}`);
    }

    console.log('\n🎉 RBAC Admin user setup complete!');
    console.log('🔗 Login to the RBAC-enabled admin dashboard:');
    console.log('   URL: http://localhost:3000/login');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('   Auto-redirect: /admin (RBAC routing)');
    console.log('\n🛡️  RBAC Features:');
    console.log('   ✅ Role-based access control');
    console.log('   ✅ Automatic admin routing');
    console.log('   ✅ Middleware protection');
    console.log('   ✅ Unified database (no separate admin DB)');
    
  } catch (error) {
    console.error('❌ Error creating RBAC admin user:', error);
    
    if (error.code === 11000) {
      console.log('💡 This error usually means the email already exists in the unified RBAC database');
    }
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
seedAdminUser();
