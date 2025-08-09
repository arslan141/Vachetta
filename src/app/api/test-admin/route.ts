import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/libs/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await connectDB();
    if (!isConnected) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection failed' 
      }, { status: 500 });
    }

    // Test admin user existence
    const adminUser = await User.findOne({ 
      email: 'admin@vachetta.com',
      role: 'admin' 
    }).select('+password');

    if (!adminUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Admin user not found. Please run the seed script.' 
      }, { status: 404 });
    }

    // Test password verification
    const passwordMatch = await bcrypt.compare('admin123', adminUser.password);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin user configuration is correct',
      admin: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        passwordValid: passwordMatch
      }
    });

  } catch (error) {
    console.error('Admin test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Server error during admin test',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
