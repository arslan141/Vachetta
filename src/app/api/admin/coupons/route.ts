import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import Coupon from "@/models/Coupon";

// GET - Fetch all coupons (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query
    let query: any = {};
    
    if (status === 'active') {
      query.isActive = true;
      query.validUntil = { $gte: new Date() };
    } else if (status === 'inactive') {
      query.isActive = false;
    } else if (status === 'expired') {
      query.validUntil = { $lt: new Date() };
    }

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await Coupon.countDocuments(query);
    
    // Calculate summary stats
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ 
      isActive: true, 
      validUntil: { $gte: new Date() } 
    });
    const expiredCoupons = await Coupon.countDocuments({ 
      validUntil: { $lt: new Date() } 
    });
    
    return NextResponse.json({
      coupons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: {
        totalCoupons,
        activeCoupons,
        expiredCoupons
      }
    });
    
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new coupon (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['code', 'name', 'description', 'discountType', 'discountValue', 'minimumOrderValue', 'usageLimit', 'validFrom', 'validUntil'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` }, 
          { status: 400 }
        );
      }
    }
    
    // Validate discount value
    if (data.discountType === 'percentage' && (data.discountValue < 0 || data.discountValue > 100)) {
      return NextResponse.json(
        { error: "Percentage discount must be between 0 and 100" }, 
        { status: 400 }
      );
    }
    
    if (data.discountValue <= 0) {
      return NextResponse.json(
        { error: "Discount value must be greater than 0" }, 
        { status: 400 }
      );
    }

    // Validate dates
    const validFrom = new Date(data.validFrom);
    const validUntil = new Date(data.validUntil);
    
    if (validUntil <= validFrom) {
      return NextResponse.json(
        { error: "Valid until date must be after valid from date" }, 
        { status: 400 }
      );
    }
    
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: data.code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json(
        { error: "Coupon code already exists" }, 
        { status: 400 }
      );
    }
    
    const coupon = new Coupon({
      ...data,
      code: data.code.toUpperCase(),
      createdBy: session.user.id,
      usedCount: 0
    });
    
    await coupon.save();
    
    return NextResponse.json({
      message: "Coupon created successfully",
      coupon
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating coupon:", error);
    
    // Handle duplicate key error
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { error: "Coupon code already exists" }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
