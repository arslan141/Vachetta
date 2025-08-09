import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";
import { Orders } from "@/models/Orders";

// GET - Fetch all customers (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const verified = searchParams.get('verified');

    // Build query - exclude admin users
    let query: any = { role: { $ne: 'admin' } };
    
    if (status) {
      query.status = status;
    }
    
    if (verified) {
      query.emailVerified = verified === 'true';
    }

    const skip = (page - 1) * limit;
    
    const customers = await User.find(query)
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await User.countDocuments(query);
    
    // Get customer order counts
    const customerOrderCounts = await Orders.aggregate([
      { $group: { _id: '$userId', orderCount: { $sum: 1 } } }
    ]);
    
    // Add order counts to customers
    const customersWithOrders = customers.map((customer: any) => {
      const orderData = customerOrderCounts.find(order => order._id === customer._id.toString());
      return {
        ...customer,
        totalOrders: orderData?.orderCount || 0
      };
    });
    
    // Calculate summary stats
    const totalCustomers = await User.countDocuments({ role: { $ne: 'admin' } });
    const verifiedCustomers = await User.countDocuments({ 
      role: { $ne: 'admin' }, 
      emailVerified: true 
    });
    const activeCustomers = await User.countDocuments({ 
      role: { $ne: 'admin' }, 
      status: 'active' 
    });
    
    return NextResponse.json({
      customers: customersWithOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: {
        totalCustomers,
        verifiedCustomers,
        activeCustomers
      }
    });
    
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new customer (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` }, 
          { status: 400 }
        );
      }
    }
    
    // Check if customer already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Customer with this email already exists" }, 
        { status: 400 }
      );
    }
    
    const customer = new User({
      ...data,
      role: 'user',
      status: data.status || 'active',
      emailVerified: data.emailVerified || false,
      createdBy: session.user.id
    });
    
    await customer.save();
    
    // Remove password from response
    const { password, ...customerResponse } = customer.toObject();
    
    return NextResponse.json({
      message: "Customer created successfully",
      customer: customerResponse
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
