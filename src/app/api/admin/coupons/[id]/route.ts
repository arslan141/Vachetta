import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import Coupon from "@/models/Coupon";

// GET - Fetch single coupon (admin only)
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
    
    const coupon = await Coupon.findById(params.id);
    
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    
    return NextResponse.json({ coupon });
    
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update coupon (admin only)
export async function PATCH(
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
    
    // If updating code, check for duplicates
    if (data.code) {
      const existingCoupon = await Coupon.findOne({ 
        code: data.code.toUpperCase(),
        _id: { $ne: params.id }
      });
      
      if (existingCoupon) {
        return NextResponse.json(
          { error: "Coupon code already exists" }, 
          { status: 400 }
        );
      }
      
      data.code = data.code.toUpperCase();
    }
    
    // Validate discount value if provided
    if (data.discountType === 'percentage' && data.discountValue && (data.discountValue < 0 || data.discountValue > 100)) {
      return NextResponse.json(
        { error: "Percentage discount must be between 0 and 100" }, 
        { status: 400 }
      );
    }
    
    if (data.discountValue && data.discountValue <= 0) {
      return NextResponse.json(
        { error: "Discount value must be greater than 0" }, 
        { status: 400 }
      );
    }

    // Validate dates if provided
    if (data.validFrom && data.validUntil) {
      const validFrom = new Date(data.validFrom);
      const validUntil = new Date(data.validUntil);
      
      if (validUntil <= validFrom) {
        return NextResponse.json(
          { error: "Valid until date must be after valid from date" }, 
          { status: 400 }
        );
      }
    }
    
    const coupon = await Coupon.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      message: "Coupon updated successfully",
      coupon
    });
    
  } catch (error) {
    console.error("Error updating coupon:", error);
    
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

// DELETE - Delete coupon (admin only)
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
    
    const coupon = await Coupon.findByIdAndDelete(params.id);
    
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      message: "Coupon deleted successfully"
    });
    
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
