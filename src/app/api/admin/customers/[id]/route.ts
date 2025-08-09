import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";
import { Orders } from "@/models/Orders";

// GET - Fetch specific customer by ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const customer = await User.findById(params.id)
      .select('-password')
      .lean();
      
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    
    // Get customer's orders
    const orders = await Orders.find({ userId: params.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    // Calculate customer stats
    const orderStats = await Orders.aggregate([
      { $match: { userId: params.id } },
      { $group: { 
        _id: null, 
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalAmount' },
        averageOrderValue: { $avg: '$totalAmount' }
      }}
    ]);
    
    return NextResponse.json({ 
      customer: {
        ...customer,
        totalOrders: orderStats[0]?.totalOrders || 0,
        totalSpent: orderStats[0]?.totalSpent || 0,
        averageOrderValue: orderStats[0]?.averageOrderValue || 0
      },
      recentOrders: orders
    });
    
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update customer (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const data = await request.json();
    
    // Remove sensitive fields that shouldn't be updated this way
    const { password, ...updateData } = data;
    
    const customer = await User.findByIdAndUpdate(
      params.id,
      {
        ...updateData,
        updatedBy: session.user.id,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');
    
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      message: "Customer updated successfully",
      customer
    });
    
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete customer (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Check if customer has orders
    const orderCount = await Orders.countDocuments({ userId: params.id });
    if (orderCount > 0) {
      return NextResponse.json({ 
        error: "Cannot delete customer with existing orders. Please deactivate instead." 
      }, { status: 400 });
    }
    
    const customer = await User.findByIdAndDelete(params.id);
    
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      message: "Customer deleted successfully"
    });
    
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
