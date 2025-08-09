import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import PurchaseOrder from "@/models/PurchaseOrder";

// GET - Fetch all purchase orders (admin only)
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
    const supplierId = searchParams.get('supplier');

    // Build query
    let query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (supplierId) {
      query.supplier = supplierId;
    }

    const skip = (page - 1) * limit;
    
    const purchaseOrders = await PurchaseOrder.find(query)
      .populate('supplier', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await PurchaseOrder.countDocuments(query);
    
    // Calculate summary stats
    const totalValue = await PurchaseOrder.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const statusCounts = await PurchaseOrder.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    return NextResponse.json({
      purchaseOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: {
        totalValue: totalValue[0]?.total || 0,
        statusCounts: statusCounts.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
    
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new purchase order (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['supplierId', 'items', 'orderDate', 'expectedDeliveryDate'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` }, 
          { status: 400 }
        );
      }
    }
    
    // Validate items array
    if (!Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" }, 
        { status: 400 }
      );
    }
    
    // Validate dates
    const orderDate = new Date(data.orderDate);
    const expectedDeliveryDate = new Date(data.expectedDeliveryDate);
    
    if (expectedDeliveryDate <= orderDate) {
      return NextResponse.json(
        { error: "Expected delivery date must be after order date" }, 
        { status: 400 }
      );
    }
    
    // Generate PO number
    const poCount = await PurchaseOrder.countDocuments();
    const poNumber = `PO-${String(poCount + 1).padStart(6, '0')}`;
    
    const purchaseOrder = new PurchaseOrder({
      poNumber,
      supplier: data.supplierId,
      items: data.items,
      subtotal: data.subtotal || 0,
      taxAmount: data.taxAmount || 0,
      totalAmount: data.totalAmount || 0,
      status: data.status || 'draft',
      orderDate: data.orderDate,
      expectedDeliveryDate: data.expectedDeliveryDate,
      paymentTerms: data.paymentTerms,
      notes: data.notes,
      createdBy: session.user.id
    });
    
    await purchaseOrder.save();
    
    // Populate supplier info for response
    await purchaseOrder.populate('supplier', 'name email');
    
    return NextResponse.json({
      message: "Purchase order created successfully",
      purchaseOrder
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating purchase order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
