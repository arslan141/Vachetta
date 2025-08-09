import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/libs/mongodb";
import VachettaOrder from "@/models/VachettaOrder";
import { VachettaOrderDocument } from "@/types/types";

export const metadata: Metadata = {
  title: "Orders Management | Vachetta Admin",
  description: "Manage all customer orders",
};

async function getOrders() {
  try {
    await connectDB();
    const orders = await VachettaOrder.find({})
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(orders)) as VachettaOrderDocument[];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'in_production':
      return 'bg-purple-100 text-purple-800';
    case 'quality_check':
      return 'bg-orange-100 text-orange-800';
    case 'shipped':
      return 'bg-indigo-100 text-indigo-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default async function AdminOrders() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  const orders = await getOrders();
  
  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order: VachettaOrderDocument) => order.orderStatus === 'pending').length;
  const processingOrders = orders.filter((order: VachettaOrderDocument) => order.orderStatus === 'in_production').length;
  const totalRevenue = orders
    .filter((order: VachettaOrderDocument) => order.orderStatus !== 'cancelled')
    .reduce((sum: number, order: VachettaOrderDocument) => sum + (order.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600 mt-2">Track and manage customer orders</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/orders/export"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Export Orders
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Processing</h3>
            <p className="text-3xl font-bold text-purple-600">{processingOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
              All Orders
            </button>
            <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200">
              Pending
            </button>
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200">
              Processing
            </button>
            <button className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200">
              Shipped
            </button>
            <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200">
              Delivered
            </button>
          </div>
        </div>

        {/* Orders Table */}
        {orders.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order: VachettaOrderDocument) => (
                    <tr key={order._id.toString()}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber || `#${order._id.toString().slice(-8).toUpperCase()}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {(order.customer as any)?.name || order.shippingAddress?.name || 'Guest'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {(order.customer as any)?.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{(order.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus || 'pending')}`}>
                          {(order.orderStatus || 'pending').charAt(0).toUpperCase() + (order.orderStatus || 'pending').slice(1).replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                          order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {(order.paymentStatus || 'pending').charAt(0).toUpperCase() + (order.paymentStatus || 'pending').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/orders/${order._id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-4">Orders will appear here once customers start purchasing.</p>
            <Link
              href="/admin/products"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Manage Products
            </Link>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
