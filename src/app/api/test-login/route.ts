import { NextResponse } from 'next/server';
import { connectDB } from '@/libs/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    await connectDB();
    const userFound = await User.findOne({ email }).select("+password");

    if (!userFound) {
      return NextResponse.json({ error: "Invalid Email" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, userFound.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid Password" }, { status: 401 });
    }

    // Return user info without password
    const userInfo = {
      id: userFound._id,
      email: userFound.email,
      name: userFound.name,
      role: userFound.role,
      phone: userFound.phone,
      emailVerified: userFound.emailVerified,
      isActive: userFound.isActive
    };

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: userInfo
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
