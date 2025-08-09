import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/libs/mongodb";
import Supplier from "@/models/Supplier";

export const metadata: Metadata = {
  title: "Suppliers Management | Vachetta Admin",
  description: "Manage supplier database and relationships",
};

async function getSuppliers() {
  try {
    await connectDB();
    const suppliers = await Supplier.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(suppliers));
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return [];
  }
}

export default async function AdminSuppliers() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  const suppliers = await getSuppliers();
  
  // Calculate stats
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((supplier: any) => supplier.status === 'active').length;
  const approvedSuppliers = suppliers.filter((supplier: any) => supplier.isApproved).length;
  const pendingSuppliers = suppliers.filter((supplier: any) => supplier.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Suppliers Management</h1>
            <p className="text-gray-600 mt-2">Manage your leather supplier network</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/suppliers/export"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Export Suppliers
            </Link>
            <Link
              href="/admin/suppliers/new"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Supplier
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Suppliers</h3>
            <p className="text-3xl font-bold text-blue-600">{totalSuppliers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Active Suppliers</h3>
            <p className="text-3xl font-bold text-green-600">{activeSuppliers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Approved</h3>
            <p className="text-3xl font-bold text-purple-600">{approvedSuppliers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Pending Review</h3>
            <p className="text-3xl font-bold text-amber-600">{pendingSuppliers}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search suppliers by name or location..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Types</option>
                <option value="leather">Leather Supplier</option>
                <option value="hardware">Hardware Supplier</option>
                <option value="tools">Tools & Equipment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Suppliers Table */}
        {suppliers.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Speciality
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {suppliers.map((supplier: any) => (
                    <tr key={supplier._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {supplier.logo ? (
                              <img
                                src={supplier.logo}
                                alt={supplier.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {supplier.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                            <div className="text-sm text-gray-500">{supplier.companyId || 'No ID'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.contactPerson || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{supplier.email}</div>
                        <div className="text-sm text-gray-500">{supplier.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.address?.city || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{supplier.address?.country || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {supplier.specialties?.join(', ') || 'General'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          supplier.status === 'active' ? 'bg-green-100 text-green-800' :
                          supplier.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {supplier.status?.charAt(0).toUpperCase() + supplier.status?.slice(1) || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < (supplier.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-500">
                            ({supplier.rating || 0})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/admin/suppliers/${supplier._id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/suppliers/${supplier._id}/edit`}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button className="text-purple-600 hover:text-purple-900">
                          Contact
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">🏭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers yet</h3>
            <p className="text-gray-500 mb-4">Start building your supplier network to manage your leather goods supply chain.</p>
            <Link
              href="/admin/suppliers/new"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add First Supplier
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
