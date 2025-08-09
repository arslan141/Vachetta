import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import RawMaterial from "@/models/RawMaterial";

// GET - Fetch all raw materials (admin only)
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
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const supplierId = searchParams.get('supplier');

    // Build query
    let query: any = {};
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (supplierId) {
      query.supplier = supplierId;
    }

    const skip = (page - 1) * limit;
    
    const materials = await RawMaterial.find(query)
      .populate('supplier', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await RawMaterial.countDocuments(query);
    
    // Calculate summary stats
    const totalValue = await RawMaterial.aggregate([
      { 
        $project: { 
          value: { $multiply: ['$currentStock', '$unitCost'] } 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$value' } 
        } 
      }
    ]);
    
    const lowStockCount = await RawMaterial.countDocuments({
      $expr: { $lte: ['$currentStock', '$minimumStock'] }
    });
    
    const outOfStockCount = await RawMaterial.countDocuments({
      currentStock: 0
    });
    
    return NextResponse.json({
      materials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: {
        totalValue: totalValue[0]?.total || 0,
        lowStockCount,
        outOfStockCount
      }
    });
    
  } catch (error) {
    console.error("Error fetching raw materials:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new raw material (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'type', 'supplier', 'description', 'currentStock', 'minimumStock', 'unitCost', 'unit'];
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        return NextResponse.json(
          { error: `${field} is required` }, 
          { status: 400 }
        );
      }
    }
    
    // Validate numeric fields
    if (data.currentStock < 0 || data.minimumStock < 0 || data.unitCost < 0) {
      return NextResponse.json(
        { error: "Stock levels and unit cost must be non-negative" }, 
        { status: 400 }
      );
    }
    
    const material = new RawMaterial({
      ...data,
      createdBy: session.user.id
    });
    
    await material.save();
    
    // Populate supplier info for response
    await material.populate('supplier', 'name email');
    
    return NextResponse.json({
      message: "Raw material created successfully",
      material
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating raw material:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
