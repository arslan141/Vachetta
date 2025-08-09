import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import Supplier from "@/models/Supplier";

// GET - Fetch all suppliers (admin only)
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
    const specialty = searchParams.get('specialty');

    // Build query
    let query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (specialty) {
      query['specialties'] = { $in: [specialty] };
    }

    const skip = (page - 1) * limit;
    
    const suppliers = await Supplier.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await Supplier.countDocuments(query);
    
    // Calculate summary stats
    const totalSuppliers = await Supplier.countDocuments();
    const activeSuppliers = await Supplier.countDocuments({ status: 'active' });
    const ratingStats = await Supplier.aggregate([
      { $group: { 
        _id: null, 
        averageRating: { $avg: '$rating' },
        highRatedSuppliers: { 
          $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] } 
        }
      }}
    ]);
    
    return NextResponse.json({
      suppliers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: {
        totalSuppliers,
        activeSuppliers,
        averageRating: ratingStats[0]?.averageRating || 0,
        highRatedSuppliers: ratingStats[0]?.highRatedSuppliers || 0
      }
    });
    
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new supplier (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` }, 
          { status: 400 }
        );
      }
    }
    
    // Check if supplier already exists
    const existingSupplier = await Supplier.findOne({ 
      $or: [{ email: data.email }, { phone: data.phone }] 
    });
    if (existingSupplier) {
      return NextResponse.json(
        { error: "Supplier with this email or phone already exists" }, 
        { status: 400 }
      );
    }
    
    const supplier = new Supplier({
      ...data,
      status: data.status || 'active',
      rating: data.rating || 5,
      createdBy: session.user.id
    });
    
    await supplier.save();
    
    return NextResponse.json({
      message: "Supplier created successfully",
      supplier
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
