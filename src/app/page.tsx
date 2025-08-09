import { Suspense } from "react";
import { Products } from "../components/products/Products";
import { getProductsLightweight } from "./actions";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";
import Link from "next/link";

const Home = async () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Artisanal Leather Goods
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Handcrafted with passion, customized with precision. Each piece tells a story of traditional craftsmanship meets modern design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/bags" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Explore Collection
            </Link>
            <Link 
              href="/custom" 
              className="border border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Customize Your Own
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Vachetta</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Custom Design</h3>
              <p className="text-gray-600">Personalize every detail from leather type to hardware finish and monogramming</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Premium Quality</h3>
              <p className="text-gray-600">Only the finest Italian leather and materials, crafted by skilled artisans</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Fast Delivery</h3>
              <p className="text-gray-600">Expertly crafted and delivered to your door in 7-14 business days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="pt-14 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Products</h2>
          <Suspense
            fallback={<ProductSkeleton extraClassname="" numberProducts={8} />}
          >
            <AllProducts />
          </Suspense>
        </div>
      </section>
    </div>
  );
};

const AllProducts = async () => {
  // Load only 8 featured products for faster homepage load
  const products = await getProductsLightweight(8);

  return <Products products={products} extraClassname="" />;
};

export default Home;
