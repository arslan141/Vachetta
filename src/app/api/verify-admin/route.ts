import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    
    const adminUser = await User.findOne({ email: 'admin@vachetta.com' });
    
    if (adminUser) {
      return NextResponse.json({
        exists: true,
        user: {
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          emailVerified: adminUser.emailVerified,
          createdAt: adminUser.createdAt,
          isActive: adminUser.isActive
        }
      });
    } else {
      return NextResponse.json({
        exists: false,
        message: 'Admin user not found'
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to check admin user',
      message: error.message
    }, { status: 500 });
  }
}
