import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import Supplier from "@/models/Supplier";

// GET - Fetch specific supplier by ID (admin only)
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
    
    const supplier = await Supplier.findById(params.id).lean();
      
    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }
    
    return NextResponse.json({ supplier });
    
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update supplier (admin only)
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
    
    const supplier = await Supplier.findByIdAndUpdate(
      params.id,
      {
        ...data,
        updatedBy: session.user.id,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      message: "Supplier updated successfully",
      supplier
    });
    
  } catch (error) {
    console.error("Error updating supplier:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete supplier (admin only)
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
    
    const supplier = await Supplier.findByIdAndDelete(params.id);
    
    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      message: "Supplier deleted successfully"
    });
    
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
