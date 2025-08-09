// Mock database for local development without MongoDB
import { EnrichedProducts } from "@/types/types";

export const mockProducts: EnrichedProducts[] = [
  {
    _id: "1",
    name: "Wireless Headphones",
    price: 99.99,
    description: "High-quality wireless headphones with noise cancellation",
    category: "electronics",
    images: ["https://via.placeholder.com/400x400?text=Headphones"],
    stock: 50,
    rating: 4.5,
    reviews: 120,
    brand: "TechBrand",
    color: "black",
    size: "standard",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Running Shoes",
    price: 79.99,
    description: "Comfortable running shoes for daily exercise",
    category: "sports",
    images: ["https://via.placeholder.com/400x400?text=Shoes"],
    stock: 30,
    rating: 4.2,
    reviews: 85,
    brand: "SportsBrand",
    color: "blue",
    size: "10",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "Coffee Maker",
    price: 149.99,
    description: "Automatic coffee maker with programmable timer",
    category: "home",
    images: ["https://via.placeholder.com/400x400?text=Coffee+Maker"],
    stock: 20,
    rating: 4.7,
    reviews: 200,
    brand: "HomeBrand",
    color: "silver",
    size: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "Smartphone",
    price: 599.99,
    description: "Latest smartphone with advanced camera features",
    category: "electronics",
    images: ["https://via.placeholder.com/400x400?text=Smartphone"],
    stock: 15,
    rating: 4.8,
    reviews: 450,
    brand: "TechBrand",
    color: "black",
    size: "6.1 inch",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    name: "Yoga Mat",
    price: 29.99,
    description: "Non-slip yoga mat for comfortable practice",
    category: "sports",
    images: ["https://via.placeholder.com/400x400?text=Yoga+Mat"],
    stock: 100,
    rating: 4.3,
    reviews: 75,
    brand: "FitnessBrand",
    color: "purple",
    size: "standard",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6",
    name: "Kitchen Knife Set",
    price: 89.99,
    description: "Professional kitchen knife set with storage block",
    category: "home",
    images: ["https://via.placeholder.com/400x400?text=Knife+Set"],
    stock: 25,
    rating: 4.6,
    reviews: 160,
    brand: "ChefBrand",
    color: "steel",
    size: "6-piece",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Mock database functions
export const mockDB = {
  async getAllProducts(): Promise<EnrichedProducts[]> {
    // Simulate async database call
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts;
  },

  async getProductsByCategory(category: string): Promise<EnrichedProducts[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.filter(product => product.category === category);
  },

  async getProductById(id: string): Promise<EnrichedProducts | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.find(product => product._id === id) || null;
  },

  async searchProducts(query: string): Promise<EnrichedProducts[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const searchTerm = query.toLowerCase();
    return mockProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }
};
