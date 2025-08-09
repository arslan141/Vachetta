import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/libs/mongodb";
import AdminProduct from "@/models/AdminProduct";
import { Orders } from "@/models/Orders";
import User from "@/models/User";
import Coupon from "@/models/Coupon";
import Supplier from "@/models/Supplier";

export const metadata: Metadata = {
  title: "Admin Dashboard | Vachetta",
  description: "Vachetta admin dashboard for managing products, orders, and suppliers",
};

async function getDashboardStats() {
  try {
    await connectDB();
    
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      totalCustomers,
      verifiedCustomers,
      totalCoupons,
      activeCoupons,
      totalSuppliers,
      recentOrders,
      recentCustomers
    ] = await Promise.all([
      AdminProduct.countDocuments(),
      AdminProduct.countDocuments({ status: 'active' }),
      AdminProduct.countDocuments({ 
        $expr: { $lte: ['$stock', 10] } // Simple low stock check
      }),
      Orders.countDocuments(),
      Orders.countDocuments({ 'orders.status': 'pending' }),
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ 
        role: { $ne: 'admin' }, 
        emailVerified: true 
      }),
      Coupon.countDocuments(),
      Coupon.countDocuments({ 
        isActive: true, 
        validUntil: { $gte: new Date() } 
      }),
      Supplier.countDocuments(),
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

    // Calculate total revenue
    const revenueResult = await Orders.aggregate([
      { $unwind: '$orders' },
      { $match: { 'orders.status': { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$orders.totalPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Calculate monthly stats
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [newOrdersThisMonth, newCustomersThisMonth] = await Promise.all([
      Orders.countDocuments({ createdAt: { $gte: lastMonth } }),
      User.countDocuments({ 
        role: { $ne: 'admin' },
        createdAt: { $gte: lastMonth } 
      })
    ]);

    const monthlyRevenueResult = await Orders.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
      { $unwind: '$orders' },
      { $match: { 'orders.status': { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$orders.totalPrice' } } }
    ]);
    const monthlyRevenue = monthlyRevenueResult.length > 0 ? monthlyRevenueResult[0].total : 0;

    return {
      overview: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        pendingOrders
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        lowStock: lowStockProducts
      },
      coupons: {
        total: totalCoupons,
        active: activeCoupons
      },
      suppliers: {
        total: totalSuppliers
      },
      orders: {
        recent: recentOrders
      },
      customers: {
        recent: recentCustomers
      },
      growth: {
        newOrdersThisMonth,
        newCustomersThisMonth,
        monthlyRevenue
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  const stats = await getDashboardStats();

  const dashboardCards = [
    {
      title: "D2C E-commerce Management",
      description: "Manage products, orders, and customers",
      cards: [
        { name: "Products", href: "/admin/products", icon: "📦", description: "Manage leather products" },
        { name: "Orders", href: "/admin/orders", icon: "📋", description: "View and manage customer orders" },
        { name: "Customers", href: "/admin/customers", icon: "👥", description: "Customer management" },
        { name: "Coupons", href: "/admin/coupons", icon: "🎟️", description: "Create and manage coupons" },
      ]
    },
    {
      title: "B2B Procurement Management",
      description: "Manage suppliers, materials, and purchase orders",
      cards: [
        { name: "Suppliers", href: "/admin/suppliers", icon: "🏭", description: "Manage supplier database" },
        { name: "Raw Materials", href: "/admin/materials", icon: "🔨", description: "Track material inventory" },
        { name: "Purchase Orders", href: "/admin/purchase-orders", icon: "📄", description: "Create and track POs" },
        { name: "Processing", href: "/admin/processing", icon: "⚙️", description: "Material processing stages" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vachetta Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {session.user.name}</p>
        </div>

        {/* KPIs Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ₹{stats?.overview.totalRevenue?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📦</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.overview.totalOrders || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.overview.totalCustomers || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📋</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.overview.pendingOrders || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Sections */}
        {dashboardCards.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              <p className="text-gray-600">{section.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.cards.map((card, cardIndex) => (
                <Link
                  key={cardIndex}
                  href={card.href}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">{card.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{card.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Additional Insights */}
        {stats && (
          <>
            {/* Growth Metrics */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Monthly Growth</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">📈</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">New Orders This Month</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.growth.newOrdersThisMonth}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-teal-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">👤</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">New Customers This Month</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.growth.newCustomersThisMonth}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">💵</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${stats.growth.monthlyRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Recent Orders */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm">
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {stats.orders.recent.length > 0 ? (
                    stats.orders.recent.map((order: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Order #{order._id.slice(-6)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.userId?.name || 'Customer'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{order.orders?.[0]?.totalPrice?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No recent orders</p>
                  )}
                </div>
              </div>

              {/* Recent Customers */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Customers</h3>
                  <Link href="/admin/customers" className="text-blue-600 hover:text-blue-800 text-sm">
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {stats.customers.recent.length > 0 ? (
                    stats.customers.recent.map((customer: any) => (
                      <div key={customer._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            customer.emailVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {customer.emailVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No recent customers</p>
                  )}
                </div>
              </div>
            </div>

            {/* Product Insights */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">📦</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.products.total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">✅</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Active Products</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.products.active}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">⚠️</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Low Stock Products</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.products.lowStock}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products/new"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Product
            </Link>
            <Link
              href="/admin/coupons/new"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Create Coupon
            </Link>
            <Link
              href="/admin/suppliers/new"
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add Supplier
            </Link>
            <Link
              href="/admin/purchase-orders/new"
              className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Create Purchase Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
