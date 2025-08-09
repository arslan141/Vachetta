"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RawMaterial {
  _id: string;
  name: string;
  type: string;
  supplier: {
    _id: string;
    name: string;
  };
  description: string;
  currentStock: number;
  minimumStock: number;
  unitCost: number;
  unit: string;
  status: 'available' | 'low_stock' | 'out_of_stock' | 'discontinued';
  createdAt: string;
}

export default function MaterialsManagement() {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch("/api/admin/materials");
      if (response.ok) {
        const data = await response.json();
        setMaterials(data.materials || []);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMaterialStatus = async (materialId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/materials/${materialId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchMaterials();
      }
    } catch (error) {
      console.error("Error updating material status:", error);
    }
  };

  const deleteMaterial = async (materialId: string) => {
    if (confirm("Are you sure you want to delete this material?")) {
      try {
        const response = await fetch(`/api/admin/materials/${materialId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchMaterials();
        }
      } catch (error) {
        console.error("Error deleting material:", error);
      }
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || material.type === typeFilter;
    const matchesStatus = statusFilter === "all" || material.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (material: RawMaterial) => {
    let status = material.status;
    
    // Auto-determine status based on stock levels if not explicitly set
    if (material.currentStock === 0) {
      status = 'out_of_stock';
    } else if (material.currentStock <= material.minimumStock) {
      status = 'low_stock';
    } else if (status === 'available') {
      status = 'available';
    }

    const statusConfig = {
      available: { bg: "bg-green-100", text: "text-green-800", label: "Available" },
      low_stock: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Low Stock" },
      out_of_stock: { bg: "bg-red-100", text: "text-red-800", label: "Out of Stock" },
      discontinued: { bg: "bg-gray-100", text: "text-gray-800", label: "Discontinued" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getTotalValue = () => {
    return materials.reduce((sum, material) => sum + (material.currentStock * material.unitCost), 0);
  };

  const getLowStockCount = () => {
    return materials.filter(material => 
      material.currentStock <= material.minimumStock && material.currentStock > 0
    ).length;
  };

  const getOutOfStockCount = () => {
    return materials.filter(material => material.currentStock === 0).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading materials...</div>
      </div>
    );
  }

  const materialTypes = [
    { value: "leather_hide", label: "Leather Hide" },
    { value: "thread", label: "Thread" },
    { value: "hardware", label: "Hardware" },
    { value: "dye", label: "Dye" },
    { value: "finish", label: "Finish" },
    { value: "tool", label: "Tool" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Raw Materials</h1>
              <p className="text-gray-600 mt-2">Manage inventory of raw materials and supplies</p>
            </div>
            <Link
              href="/admin/materials/new"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Material
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Materials</p>
                <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{getLowStockCount()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{getOutOfStockCount()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Materials
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or supplier..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {materialTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
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
                <option value="available">Available</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Cost
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
                {filteredMaterials.map((material) => (
                  <tr key={material._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{material.name}</div>
                        <div className="text-sm text-gray-500">{material.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {materialTypes.find(t => t.value === material.type)?.label || material.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{material.supplier.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {material.currentStock} {material.unit}
                        </div>
                        <div className="text-sm text-gray-500">
                          Min: {material.minimumStock} {material.unit}
                        </div>
                        {material.currentStock <= material.minimumStock && (
                          <div className="w-full bg-red-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{ width: `${(material.currentStock / material.minimumStock) * 100}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${material.unitCost.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">per {material.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(material)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/materials/${material._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => updateMaterialStatus(
                            material._id, 
                            material.status === 'discontinued' ? 'available' : 'discontinued'
                          )}
                          className={`${
                            material.status === 'discontinued' 
                              ? 'text-green-600 hover:text-green-900' 
                              : 'text-yellow-600 hover:text-yellow-900'
                          }`}
                        >
                          {material.status === 'discontinued' ? 'Reactivate' : 'Discontinue'}
                        </button>
                        <button
                          onClick={() => deleteMaterial(material._id)}
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

          {filteredMaterials.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No materials found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
