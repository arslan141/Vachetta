"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PurchaseOrder {
  _id: string;
  poNumber: string;
  supplier: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    materialId: string;
    materialName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'sent' | 'received' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  paymentTerms: string;
  notes: string;
  createdAt: string;
  createdBy: string;
}

export default function PurchaseOrdersManagement() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const response = await fetch("/api/admin/purchase-orders");
      if (response.ok) {
        const data = await response.json();
        setPurchaseOrders(data.purchaseOrders || []);
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePOStatus = async (poId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/purchase-orders/${poId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchPurchaseOrders();
      }
    } catch (error) {
      console.error("Error updating purchase order status:", error);
    }
  };

  const deletePO = async (poId: string) => {
    if (confirm("Are you sure you want to delete this purchase order?")) {
      try {
        const response = await fetch(`/api/admin/purchase-orders/${poId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchPurchaseOrders();
        }
      } catch (error) {
        console.error("Error deleting purchase order:", error);
      }
    }
  };

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || po.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      approved: { bg: "bg-blue-100", text: "text-blue-800", label: "Approved" },
      sent: { bg: "bg-purple-100", text: "text-purple-800", label: "Sent" },
      received: { bg: "bg-green-100", text: "text-green-800", label: "Received" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getTotalValue = () => {
    return purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
  };

  const getStatusCounts = () => {
    return purchaseOrders.reduce((counts, po) => {
      counts[po.status] = (counts[po.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading purchase orders...</div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
              <p className="text-gray-600 mt-2">Manage purchase orders for raw materials and supplies</p>
            </div>
            <Link
              href="/admin/purchase-orders/new"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Purchase Order
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total POs</p>
                <p className="text-2xl font-bold text-gray-900">{purchaseOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.pending || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">📤</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sent</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.sent || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Received</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.received || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${getTotalValue().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Purchase Orders
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by PO number or supplier..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="sent">Sent</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Purchase Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PO Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPOs.map((po) => (
                  <tr key={po._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{po.poNumber}</div>
                        <div className="text-sm text-gray-500">{po.items.length} items</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{po.supplier.name}</div>
                        <div className="text-sm text-gray-500">{po.supplier.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">${po.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Subtotal: ₹{po.subtotal.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          Ordered: {new Date(po.orderDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Expected: {new Date(po.expectedDeliveryDate).toLocaleDateString()}
                        </div>
                        {po.actualDeliveryDate && (
                          <div className="text-sm text-green-600">
                            Delivered: {new Date(po.actualDeliveryDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(po.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/purchase-orders/${po._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/purchase-orders/${po._id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        {po.status === 'sent' && (
                          <button
                            onClick={() => updatePOStatus(po._id, 'received')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Mark Received
                          </button>
                        )}
                        {po.status === 'draft' && (
                          <button
                            onClick={() => updatePOStatus(po._id, 'pending')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Submit
                          </button>
                        )}
                        <button
                          onClick={() => deletePO(po._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPOs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No purchase orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
