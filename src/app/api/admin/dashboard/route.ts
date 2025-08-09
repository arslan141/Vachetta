import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import AdminProduct from "@/models/AdminProduct";
import { Orders } from "@/models/Orders";
import User from "@/models/User";
import Coupon from "@/models/Coupon";
import Supplier from "@/models/Supplier";
import RawMaterial from "@/models/RawMaterial";
import PurchaseOrder from "@/models/PurchaseOrder";

// GET - Fetch dashboard statistics (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Fetch all statistics in parallel for better performance
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalCustomers,
      verifiedCustomers,
      totalCoupons,
      activeCoupons,
      totalSuppliers,
      activeSuppliers,
      totalMaterials,
      lowStockMaterials,
      totalPurchaseOrders,
      pendingPurchaseOrders,
      recentOrders,
      recentCustomers
    ] = await Promise.all([
      // Products
      AdminProduct.countDocuments(),
      AdminProduct.countDocuments({ status: 'active' }),
      AdminProduct.countDocuments({ 
        $expr: { $lte: ['$stock', '$reorderLevel'] }
      }),
      
      // Orders
      Orders.countDocuments(),
      Orders.countDocuments({ status: 'pending' }),
      Orders.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $unwind: '$orders' },
        { $group: { _id: null, total: { $sum: '$orders.totalPrice' } } }
      ]),
      
      // Customers
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ 
        role: { $ne: 'admin' }, 
        emailVerified: true 
      }),
      
      // Coupons
      Coupon.countDocuments(),
      Coupon.countDocuments({ 
        isActive: true, 
        validUntil: { $gte: new Date() } 
      }),
      
      // Suppliers
      Supplier.countDocuments(),
      Supplier.countDocuments({ status: 'active' }),
      
      // Materials
      RawMaterial.countDocuments(),
      RawMaterial.countDocuments({ 
        $expr: { $lte: ['$currentStock', '$minimumStock'] }
      }),
      
      // Purchase Orders
      PurchaseOrder.countDocuments(),
      PurchaseOrder.countDocuments({ status: 'pending' }),
      
      // Recent data for activity feed
      Orders.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      
      User.find({ role: { $ne: 'admin' } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt emailVerified')
        .lean()
    ]);

    // Calculate revenue safely
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // Get order status distribution
    const orderStatusDistribution = await Orders.aggregate([
      { $unwind: '$orders' },
      { $group: { _id: '$orders.status', count: { $sum: 1 } } }
    ]);

    // Get product category distribution
    const productCategoryDistribution = await AdminProduct.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Calculate growth metrics (comparing with last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [
      newOrdersThisMonth,
      newCustomersThisMonth,
      revenueThisMonth
    ] = await Promise.all([
      Orders.countDocuments({ createdAt: { $gte: lastMonth } }),
      User.countDocuments({ 
        role: { $ne: 'admin' },
        createdAt: { $gte: lastMonth } 
      }),
      Orders.aggregate([
        { 
          $match: { 
            createdAt: { $gte: lastMonth },
            status: { $ne: 'cancelled' }
          } 
        },
        { $unwind: '$orders' },
        { $group: { _id: null, total: { $sum: '$orders.totalPrice' } } }
      ])
    ]);

    const monthlyRevenue = revenueThisMonth.length > 0 ? revenueThisMonth[0].total : 0;

    return NextResponse.json({
      overview: {
        totalRevenue: revenue,
        totalOrders,
        totalCustomers,
        pendingOrders
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        lowStock: lowStockProducts,
        categoryDistribution: productCategoryDistribution
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        statusDistribution: orderStatusDistribution,
        recent: recentOrders
      },
      customers: {
        total: totalCustomers,
        verified: verifiedCustomers,
        recent: recentCustomers
      },
      coupons: {
        total: totalCoupons,
        active: activeCoupons
      },
      suppliers: {
        total: totalSuppliers,
        active: activeSuppliers
      },
      materials: {
        total: totalMaterials,
        lowStock: lowStockMaterials
      },
      purchaseOrders: {
        total: totalPurchaseOrders,
        pending: pendingPurchaseOrders
      },
      growth: {
        newOrdersThisMonth,
        newCustomersThisMonth,
        monthlyRevenue
      }
    });
    
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
