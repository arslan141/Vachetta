import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/libs/mongodb";
import AdminProduct, { IProduct } from "@/models/AdminProduct";
import LeatherProduct from "@/models/LeatherProduct";

// Basic type for LeatherProduct to fix TypeScript errors
interface ILeatherProduct {
  _id: string;
  name: string;
  category: string;
  leatherType: string;
  price: number;
  stock: number;
  sku: string;
  images?: Array<{ url: string; alt: string; isPrimary: boolean }>;
  craftmanship?: { artisan?: string };
}

export const metadata: Metadata = {
  title: "Products Management | Vachetta Admin",
  description: "Manage all products in the Vachetta store",
};

async function getProducts() {
  try {
    await connectDB();
    const products = await AdminProduct.find({}).sort({ createdAt: -1 }).lean();
    const leatherProducts = await LeatherProduct.find({}).sort({ createdAt: -1 }).lean();
    
    return {
      products: JSON.parse(JSON.stringify(products)),
      leatherProducts: JSON.parse(JSON.stringify(leatherProducts))
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], leatherProducts: [] };
  }
}

export default async function AdminProducts() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  const { products, leatherProducts } = await getProducts();
  const totalProducts = products.length + leatherProducts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
            <p className="text-gray-600 mt-2">Manage your leather goods inventory</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/products/new"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Product
            </Link>
            <Link
              href="/admin/leather-products/new"
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add Premium Product
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Regular Products</h3>
            <p className="text-3xl font-bold text-green-600">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Premium Products</h3>
            <p className="text-3xl font-bold text-purple-600">{leatherProducts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Featured Products</h3>
            <p className="text-3xl font-bold text-amber-600">{products.filter((p: IProduct) => p.isFeatured).length}</p>
          </div>
        </div>

        {/* Regular Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Regular Products ({products.length})</h2>
          {products.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
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
                    {products.map((product: IProduct) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.images && product.images.length > 0 && (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg mr-4"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock > 10 ? 'bg-green-100 text-green-800' : 
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            View
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
              <p className="text-gray-500">No regular products found.</p>
              <Link
                href="/admin/products/new"
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add First Product
              </Link>
            </div>
          )}
        </div>

        {/* Premium Leather Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Premium Leather Products ({leatherProducts.length})</h2>
          {leatherProducts.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leather Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Artisan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leatherProducts.map((product: ILeatherProduct) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.images && product.images.length > 0 && (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg mr-4"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {product.leatherType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.craftmanship?.artisan || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock > 5 ? 'bg-green-100 text-green-800' : 
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/admin/leather-products/${product._id}/edit`}
                            className="text-purple-600 hover:text-purple-900 mr-4"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/admin/leather-products/${product._id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            View
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
              <p className="text-gray-500">No premium leather products found.</p>
              <Link
                href="/admin/leather-products/new"
                className="mt-4 inline-block bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                Add First Premium Product
              </Link>
            </div>
          )}
        </div>

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
