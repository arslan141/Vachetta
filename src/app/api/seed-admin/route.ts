import { NextResponse } from "next/server";
import { seedAdminUser } from "@/scripts/seed-admin";

export async function POST() {
  try {
    console.log('🚀 Starting admin user seeding...');
    const result = await seedAdminUser();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        credentials: {
          email: 'admin@vachetta.com',
          password: 'admin123',
          loginUrl: '/admin'
        }
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API Error seeding admin user:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to seed admin user',
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Admin seeding endpoint',
    instructions: 'Send a POST request to this endpoint to create the admin user',
    credentials: {
      email: 'admin@vachetta.com',
      password: 'admin123'
    }
  });
}
