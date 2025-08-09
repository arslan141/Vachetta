"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface CollectionFiltersProps {
  currentCategory: string;
  currentSortBy: string;
  currentPriceRange: string;
}

export const CollectionFilters = ({ 
  currentCategory, 
  currentSortBy, 
  currentPriceRange 
}: CollectionFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    { value: 'all', label: 'All Products', icon: '🛍️' },
    { value: 'bags', label: 'Bags', icon: '👜' },
    { value: 'premium-bags', label: 'Premium Bags', icon: '💼' },
    { value: 'wallets', label: 'Wallets', icon: '👛' },
    { value: 'luxury-wallets', label: 'Luxury Wallets', icon: '💳' },
    { value: 'belts', label: 'Belts', icon: '👔' },
    { value: 'custom-belts', label: 'Custom Belts', icon: '⚙️' },
    { value: 'accessories', label: 'Accessories', icon: '🎭' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: 'Under ₹50' },
    { value: '50-100', label: '₹50 - ₹100' },
    { value: '100-200', label: '₹100 - ₹200' },
    { value: '200-500', label: '₹200 - ₹500' },
    { value: '500', label: '₹500+' },
  ];

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === 'newest') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    const queryString = params.toString();
    const newPath = queryString ? `/dashboard?${queryString}` : '/dashboard';
    router.push(newPath);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span className="font-medium">Filters & Collections</span>
          <svg 
            className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Collection Categories */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Collections</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => updateFilter('category', category.value)}
                className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                  currentCategory === category.value
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl mb-1">{category.icon}</span>
                <span className="text-xs font-medium text-center">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort and Price Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sort Options */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Sort By</h4>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilter('sortBy', option.value)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    currentSortBy === option.value
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Price Range</h4>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => updateFilter('priceRange', range.value)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    currentPriceRange === range.value
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(currentCategory !== 'all' || currentSortBy !== 'newest' || currentPriceRange !== 'all') && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Clear All Filters
            </Link>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(currentCategory !== 'all' || currentSortBy !== 'newest' || currentPriceRange !== 'all') && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h5>
          <div className="flex flex-wrap gap-2">
            {currentCategory !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                {categories.find(c => c.value === currentCategory)?.label}
                <button 
                  onClick={() => updateFilter('category', 'all')}
                  className="ml-1 text-amber-600 hover:text-amber-800"
                >
                  ×
                </button>
              </span>
            )}
            {currentSortBy !== 'newest' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {sortOptions.find(s => s.value === currentSortBy)?.label}
                <button 
                  onClick={() => updateFilter('sortBy', 'newest')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {currentPriceRange !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {priceRanges.find(p => p.value === currentPriceRange)?.label}
                <button 
                  onClick={() => updateFilter('priceRange', 'all')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
