/**
 * RBAC Admin User Seeding Script
 * Creates an admin user with proper role-based access control
 * Uses the same database as regular users but with 'admin' role
 */

import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function seedAdminUser() {
  try {
    // Connect to the main application database (RBAC approach)
    console.log('🔌 Connecting to main application database...');
    await connectDB();
    console.log('✅ Connected to vachetta-db database');

    // Admin user details (RBAC-based admin)
    const adminEmail = 'admin@vachetta.com';
    const adminPassword = 'admin123';
    const adminName = 'Vachetta Admin';

    // Check if admin user already exists in the main database
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists in RBAC system:', adminEmail);
      
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
      console.log(`   Database: vachetta-db (unified RBAC database)`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
      
      return {
        success: true,
        message: 'RBAC admin user already exists',
        user: existingAdmin,
        rbacEnabled: true
      };
    } else {
      // Hash the password
      console.log('🔐 Hashing password...');
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      // Create RBAC admin user in main database
      console.log('👤 Creating RBAC admin user...');
      const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'admin', // RBAC role assignment
        emailVerified: true, // Admin user is pre-verified
        isActive: true,
        preferences: {
          emailNotifications: true,
          orderUpdates: true,
          promotionalEmails: false
        }
      });

      await adminUser.save();
      console.log('✅ RBAC admin user created successfully!');
      console.log('👤 RBAC Admin user details:');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Role: ${adminUser.role} (RBAC-enabled)`);
      console.log(`   Database: vachetta-db (unified RBAC database)`);
      console.log(`   Auto-redirect: /admin (RBAC routing)`);
      console.log(`   Created: ${adminUser.createdAt}`);

      return {
        success: true,
        message: 'RBAC admin user created successfully',
        user: adminUser,
        rbacEnabled: true
      };
    }
  } catch (error: any) {
    console.error('❌ Error creating RBAC admin user:', error);
    
    if (error.code === 11000) {
      console.log('💡 This error usually means the email already exists in the unified RBAC database');
    }
    
    return {
      success: false,
      message: 'Failed to create RBAC admin user',
      error: error.message || 'Unknown error',
      rbacEnabled: true
    };
  }
}

// For direct execution
if (require.main === module) {
  seedAdminUser().then(() => {
    console.log('\n🎉 RBAC Admin user setup complete!');
    console.log('🔗 Login to the RBAC-enabled admin dashboard:');
    console.log('   URL: http://localhost:3000/login');
    console.log('   Email: admin@vachetta.com');
    console.log('   Password: admin123');
    console.log('   Auto-redirect: /admin (RBAC routing)');
    console.log('\n🛡️  RBAC Features:');
    console.log('   ✅ Role-based access control');
    console.log('   ✅ Automatic admin routing');
    console.log('   ✅ Middleware protection');
    console.log('   ✅ Unified database (no separate admin DB)');
    process.exit(0);
  }).catch((error) => {
    console.error('Failed to seed RBAC admin user:', error);
    process.exit(1);
  });
}
