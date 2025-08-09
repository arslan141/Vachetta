"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Supplier {
  _id: string;
  name: string;
  email: string;
  paymentTerms: string;
}

interface Material {
  _id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  standardPrice: number;
}

interface POItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function CreatePurchaseOrder() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  const [formData, setFormData] = useState({
    supplierId: "",
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: "",
    paymentTerms: "",
    notes: "",
    taxRate: 8.5
  });

  const [items, setItems] = useState<POItem[]>([
    { materialId: "", materialName: "", quantity: 1, unitPrice: 0, totalPrice: 0 }
  ]);

  useEffect(() => {
    fetchSuppliers();
    fetchMaterials();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("/api/admin/suppliers");
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data.suppliers || []);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await fetch("/api/admin/materials");
      if (response.ok) {
        const data = await response.json();
        setMaterials(data.materials || []);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleSupplierChange = (supplierId: string) => {
    const supplier = suppliers.find(s => s._id === supplierId);
    setSelectedSupplier(supplier || null);
    setFormData(prev => ({ 
      ...prev, 
      supplierId, 
      paymentTerms: supplier?.paymentTerms || "" 
    }));
  };

  const handleMaterialChange = (index: number, materialId: string) => {
    const material = materials.find(m => m._id === materialId);
    if (material) {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        materialId,
        materialName: material.name,
        unitPrice: material.standardPrice,
        totalPrice: newItems[index].quantity * material.standardPrice
      };
      setItems(newItems);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      quantity,
      totalPrice: quantity * newItems[index].unitPrice
    };
    setItems(newItems);
  };

  const handlePriceChange = (index: number, unitPrice: number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      unitPrice,
      totalPrice: newItems[index].quantity * unitPrice
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { materialId: "", materialName: "", quantity: 1, unitPrice: 0, totalPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateTaxAmount = () => {
    return (calculateSubtotal() * formData.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxAmount();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/purchase-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items: items.filter(item => item.materialId), // Only include items with materials
          subtotal: calculateSubtotal(),
          taxAmount: calculateTaxAmount(),
          totalAmount: calculateTotal(),
          status: "draft"
        }),
      });

      if (response.ok) {
        router.push("/admin/purchase-orders");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create purchase order");
      }
    } catch (error) {
      console.error("Error creating purchase order:", error);
      alert("Failed to create purchase order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Purchase Order</h1>
              <p className="text-gray-600 mt-2">Create a new purchase order for raw materials</p>
            </div>
            <Link
              href="/admin/purchase-orders"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Purchase Orders
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier *
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => handleSupplierChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  {selectedSupplier && (
                    <p className="text-sm text-gray-500 mt-1">{selectedSupplier.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Date *
                  </label>
                  <input
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, orderDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Delivery Date *
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Material
                      </label>
                      <select
                        value={item.materialId}
                        onChange={(e) => handleMaterialChange(index, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Material</option>
                        {materials.map(material => (
                          <option key={material._id} value={material._id}>
                            {material.name} - {material.category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Price (₹)
                      </label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex items-end">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total
                        </label>
                        <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                          ₹{item.totalPrice.toFixed(2)}
                        </div>
                      </div>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="ml-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({formData.taxRate}%):</span>
                  <span>${calculateTaxAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <textarea
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Net 30, 2/10 Net 30, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Special instructions or notes..."
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Link
                href="/admin/purchase-orders"
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || items.every(item => !item.materialId)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? "Creating..." : "Create Purchase Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
