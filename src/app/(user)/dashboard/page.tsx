import Link from "next/link";
import { Suspense } from "react";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { Loader } from "@/components/common/Loader";
import { EnhancedProductListing } from "@/components/dashboard/EnhancedProductListing";
import { CollectionFilters } from "@/components/dashboard/CollectionFilters";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { getProductsLightweight } from "@/app/actions";
import { SerializedProduct } from "@/types/types";
import { cache } from 'react';

export async function generateMetadata() {
  return {
    title: "Dashboard | Vachetta Leather Goods",
    description: "Your personal dashboard for browsing and managing leather goods collections",
  };
}

// Cache the session fetch
const getCachedSession = cache(async () => {
  return await getServerSession(authOptions);
});

const UserDashboard = async ({ searchParams }: { searchParams: any }) => {
  const session: Session | null = await getCachedSession();
  
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-91px)] gap-6 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Your Dashboard</h1>
          <p className="text-lg text-gray-600 mb-6">
            Sign in to explore our curated collections, track your orders, and discover personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const category = searchParams?.category || 'all';
  const sortBy = searchParams?.sortBy || 'newest';
  const priceRange = searchParams?.priceRange || 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session.user.name?.split(' ')[0] || 'Customer'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Discover our handcrafted leather collections with enhanced filtering and customization options
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex gap-3">
              <Link
                href="/orders"
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                My Orders
              </Link>
              <Link
                href="/wishlist"
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Wishlist
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <Suspense fallback={<div className="h-32 bg-white rounded-lg animate-pulse mb-8"></div>}>
          <DashboardStats session={session} />
        </Suspense>

        {/* Collection Filters */}
        <div className="mb-8">
          <CollectionFilters 
            currentCategory={category}
            currentSortBy={sortBy}
            currentPriceRange={priceRange}
          />
        </div>

        {/* Enhanced Product Listings - Load initial 12 products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {category === 'all' ? 'All Collections' : 
               category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </h2>
          </div>
          
          <Suspense 
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <OptimizedProductListings 
              category={category}
              sortBy={sortBy}
              priceRange={priceRange}
              session={session}
            />
          </Suspense>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link href="/bags" className="group">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                    Explore Bags
                  </h3>
                  <p className="text-gray-600 mt-1">Handcrafted leather bags for every occasion</p>
                </div>
                <div className="text-amber-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/wallets" className="group">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                    Browse Wallets
                  </h3>
                  <p className="text-gray-600 mt-1">Premium leather wallets and accessories</p>
                </div>
                <div className="text-amber-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"/>
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/belts" className="group">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                    Custom Belts
                  </h3>
                  <p className="text-gray-600 mt-1">Bespoke leather belts made to order</p>
                </div>
                <div className="text-amber-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

const OptimizedProductListings = async ({ 
  category, 
  sortBy, 
  priceRange, 
  session 
}: { 
  category: string; 
  sortBy: string; 
  priceRange: string;
  session: Session;
}) => {
  // Use lightweight product fetch - only get first 20 products
  const allProducts: SerializedProduct[] = await getProductsLightweight(20);
  
  // Filter products based on category (client-side for faster initial load)
  let filteredProducts = allProducts;
  if (category !== 'all') {
    filteredProducts = allProducts.filter(product => 
      product.category === category || 
      product.category?.includes(category)
    );
  }

  // Filter by price range
  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-').map(Number);
    filteredProducts = filteredProducts.filter(product => {
      const price = product.price;
      if (max) {
        return price >= min && price <= max;
      } else {
        return price >= min; // for "500+" case
      }
    });
  }

  // Sort products
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
    default:
      // Keep default order (newest first)
      break;
  }

  // Limit to 12 products for initial load
  const displayProducts = filteredProducts.slice(0, 12);

  return (
    <>
      <EnhancedProductListing 
        products={displayProducts} 
        session={session}
      />
      {filteredProducts.length > 12 && (
        <div className="text-center mt-8">
          <Link
            href={`/${category}`}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors inline-flex items-center"
          >
            View All {filteredProducts.length} Products
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
