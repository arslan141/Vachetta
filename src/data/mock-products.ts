// Mock products data for local development
import { Types } from "mongoose";

export const mockProducts = [
  {
    _id: new Types.ObjectId("507f1f77bcf86cd799439011"),
    productId: new Types.ObjectId("507f1f77bcf86cd799439011"),
    variantId: "variant-1",
    name: "Wireless Bluetooth Headphones",
    category: "electronics",
    image: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop"
    ],
    price: 199.99,
    purchased: false,
    color: "black",
    size: "medium",
    quantity: 25
  },
  {
    _id: new Types.ObjectId("507f1f77bcf86cd799439012"),
    productId: new Types.ObjectId("507f1f77bcf86cd799439012"),
    variantId: "variant-2",
    name: "Smart Fitness Watch",
    category: "electronics",
    image: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop"
    ],
    price: 299.99,
    purchased: false,
    color: "silver",
    size: "large",
    quantity: 15
  },
  {
    _id: new Types.ObjectId("507f1f77bcf86cd799439013"),
    productId: new Types.ObjectId("507f1f77bcf86cd799439013"),
    variantId: "variant-3",
    name: "Organic Cotton T-Shirt",
    category: "clothing",
    image: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f37f4ec2?w=500&h=500&fit=crop"
    ],
    price: 29.99,
    purchased: false,
    color: "white",
    size: "medium",
    quantity: 50
  },
  {
    _id: new Types.ObjectId("507f1f77bcf86cd799439014"),
    productId: new Types.ObjectId("507f1f77bcf86cd799439014"),
    variantId: "variant-4",
    name: "Premium Coffee Beans",
    category: "food",
    image: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500&h=500&fit=crop"
    ],
    price: 24.99,
    purchased: false,
    color: "brown",
    size: "500g",
    quantity: 100
  },
  {
    _id: new Types.ObjectId("507f1f77bcf86cd799439015"),
    productId: new Types.ObjectId("507f1f77bcf86cd799439015"),
    variantId: "variant-5",
    name: "Yoga Mat Premium",
    category: "sports",
    image: [
      "https://images.unsplash.com/photo-1506629905583-7d90c94b02c8?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop"
    ],
    price: 49.99,
    purchased: false,
    color: "purple",
    size: "6mm",
    quantity: 30
  },
  {
    _id: new Types.ObjectId("507f1f77bcf86cd799439016"),
    productId: new Types.ObjectId("507f1f77bcf86cd799439016"),
    variantId: "variant-6",
    name: "Desk Lamp LED",
    category: "home",
    image: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop"
    ],
    price: 79.99,
    purchased: false,
    color: "white",
    size: "adjustable",
    quantity: 20
  },
  {
    _id: new Types.ObjectId("507f1f77bcf86cd799439017"),
    productId: new Types.ObjectId("507f1f77bcf86cd799439017"),
    variantId: "variant-7",
    name: "Running Shoes",
    category: "clothing",
    image: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop"
    ],
    price: 129.99,
    purchased: false,
    color: "blue",
    size: "10",
    quantity: 45
  },
  {
    _id: new Types.ObjectId("507f1f77bcf86cd799439018"),
    productId: new Types.ObjectId("507f1f77bcf86cd799439018"),
    variantId: "variant-8",
    name: "Smartphone Case",
    category: "electronics",
    image: [
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop"
    ],
    price: 19.99,
    purchased: false,
    color: "black",
    size: "universal",
    quantity: 75
  }
];
