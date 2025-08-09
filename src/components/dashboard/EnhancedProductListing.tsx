"use client";

import Link from "next/link";
import { useState } from "react";
import { Session } from "next-auth";
import { SerializedProduct } from "@/types/types";
import { Images } from "@/components/products/Images";
import { colorMapping } from "@/helpers/colorMapping";
import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";

const WishlistButton = dynamic(() => import("../cart/WishlistButton"), {
  loading: () => <Skeleton className="w-5 h-5" />,
});

const QuickAddToCart = dynamic(() => import("../cart/QuickAddToCart"), {
  loading: () => <Skeleton className="w-full h-8" />,
});

interface EnhancedProductListingProps {
  products: SerializedProduct[];
  session: Session;
}

export const EnhancedProductListing = ({ products, session }: EnhancedProductListingProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters or browse all collections.</p>
      </div>
    );
  }

  return (
    <div>
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Showing {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
        <div className="flex border border-gray-300 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-l-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-amber-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-r-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-amber-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Products Display */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      }>
        {products.map((product, index) => (
          <ProductCard 
            key={product._id.toString()} 
            product={product} 
            session={session}
            viewMode={viewMode}
            priority={index < 4}
          />
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ 
  product, 
  session, 
  viewMode, 
  priority 
}: { 
  product: SerializedProduct; 
  session: Session;
  viewMode: 'grid' | 'list';
  priority: boolean;
}) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  
  const productLink = `/${product.category}/${product._id}`;
  
  // Get available colors from variants (fallback to default colors)
  const availableColors = product.variants && product.variants.length > 0 
    ? product.variants.map((v: any) => v.color)
    : ['Rich Brown', 'Natural', 'Black'];
  
  // Get unique colors
  const uniqueColors = Array.from(new Set(availableColors));
  
  // Get available sizes
  const availableSizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : ['S', 'M', 'L'];

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
        <div className="flex">
          <Link href={productLink} className="flex-shrink-0">
            <div className="w-48 h-48">
              <Images
                image={product.image}
                name={product.name}
                width={200}
                height={200}
                priority={priority}
                sizes="200px"
              />
            </div>
          </Link>
          
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Link href={productLink}>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors mb-2">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description || "Premium handcrafted leather goods with exceptional quality and attention to detail."}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-gray-900">
                    ₹{product.price}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Color Options */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Colors:</span>
                      <div className="flex space-x-1">
                        {uniqueColors.slice(0, 3).map((color: string, index: number) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer hover:border-amber-500 transition-colors"
                            style={{ backgroundColor: colorMapping[color] || '#8B4513' }}
                            title={color}
                          />
                        ))}
                        {uniqueColors.length > 3 && (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-600 bg-gray-100">
                            +{uniqueColors.length - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Size Options */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Sizes:</span>
                      <div className="flex space-x-1">
                        {availableSizes.slice(0, 3).map((size: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-600 bg-gray-50"
                          >
                            {size}
                          </span>
                        ))}
                        {availableSizes.length > 3 && (
                          <span className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-600 bg-gray-50">
                            +{availableSizes.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <WishlistButton
                      session={session}
                      productId={JSON.stringify(product._id)}
                      wishlistString="{}"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 group">
      <div className="relative overflow-hidden rounded-t-lg">
        <Link href={productLink}>
          <div className="w-full h-64">
            <Images
              image={product.image}
              name={product.name}
              width={300}
              height={400}
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          </div>
        </Link>
        
        <div className="absolute top-3 right-3">
          <WishlistButton
            session={session}
            productId={JSON.stringify(product._id)}
            wishlistString="{}"
          />
        </div>
      </div>

      <div className="p-4">
        <Link href={productLink}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-bold text-gray-900">
            ₹{product.price}
          </div>
          <div className="text-sm text-gray-600">
            {product.category?.charAt(0).toUpperCase() + product.category?.slice(1).replace('-', ' ')}
          </div>
        </div>

        {/* Enhanced Color Selection */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Color:</span>
            <span className="text-xs text-gray-500">{uniqueColors[selectedVariant] || uniqueColors[0]}</span>
          </div>
          <div className="flex space-x-2">
            {uniqueColors.slice(0, 4).map((color: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedVariant(index)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedVariant === index 
                    ? 'border-amber-500 ring-2 ring-amber-200' 
                    : 'border-gray-300 hover:border-amber-400'
                }`}
                style={{ backgroundColor: colorMapping[color] || '#8B4513' }}
                title={color}
              />
            ))}
            {uniqueColors.length > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-600 bg-gray-100">
                +{uniqueColors.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Size Selection */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Available Sizes:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 text-sm border border-gray-300 rounded-full text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors cursor-default"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Add to Cart Button */}
        <div className="flex space-x-2">
          <QuickAddToCart
            product={product}
            session={session}
          />
          <Link
            href={productLink}
            className="bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors text-center text-sm font-medium block whitespace-nowrap"
          >
            Customize
          </Link>
        </div>
      </div>
    </div>
  );
};
