import { getProductsLightweight } from "../actions";

export default async function TestPage() {
  console.log("🔍 Testing product loading...");
  
  try {
    const products = await getProductsLightweight(8);
    console.log("✅ Products loaded:", products.length);
    console.log("📦 Sample product:", products[0]);
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Product Test Page</h1>
        <p>Found {products.length} products</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded">
              <img 
                src={typeof product.image[0] === 'string' ? product.image[0] : product.image[0]?.url || '/main-image.webp'} 
                alt={product.name}
                className="w-full h-48 object-cover mb-2"
              />
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ Error loading products:", error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Product Test Page</h1>
        <p className="text-red-500">Error loading products: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
