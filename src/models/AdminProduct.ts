import mongoose, { Schema, model, models } from 'mongoose';

// Interface for Product
export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  stock: number;
  sku: string;
  material?: string;
  color?: string;
  size?: string;
  weight?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
  features?: string[];
  care?: string[];
  isActive: boolean;
  isFeatured: boolean;
  rating: {
    average: number;
    count: number;
  };
  tags?: string[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Product
const AdminProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  category: {
    type: String,
    required: true,
    enum: ['bags', 'wallets', 'belts', 'accessories', 'jackets']
  },
  subcategory: {
    type: String,
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    type: Number,
    default: 0,
  },
  sku: {
    type: String,
    unique: true,
    required: true,
  },
  material: {
    type: String,
    default: 'Premium Leather'
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
  weight: {
    type: String,
  },
  dimensions: {
    length: String,
    width: String,
    height: String
  },
  features: [String],
  care: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    }
  },
  tags: [String],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true,
});

// Create and export the model
const AdminProduct = models.Product || model<IProduct>('Product', AdminProductSchema);

export default AdminProduct;
