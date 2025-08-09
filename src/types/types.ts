import { Document, Schema } from "mongoose";

// Legacy types for backward compatibility
export interface EnrichedOrders {
  name: string;
  email: string;
  phone: string | null;
  address: AddressDocument;
  products: [EnrichedProducts];
  orderId: string;
  total_price: number;
  orderNumber: string;
  expectedDeliveryDate: Date;
  purchaseDate: string;
  _id: string;
}

export interface EnrichedProducts {
  name: string;
  category: string;
  image: [string];
  price: number;
  purchased: boolean;
  color: string;
  size: string;
  quantity: number;
  productId: Schema.Types.ObjectId;
  _id: Schema.Types.ObjectId;
  variantId: string;
}

export interface OrdersDocument extends Document {
  userId: string;
  orders: [OrderDocument];
}

export interface OrderDocument {
  name: string;
  email: string;
  phone: number;
  address: AddressDocument;
  products: [ProductsDocument];
  orderId: string;
  purchaseDate: Date;
  expectedDeliveryDate: Date;
  total_price: number;
  orderNumber: string;
  _id: Schema.Types.ObjectId;
}

export interface AddressDocument {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
}

export interface ProductsDocument {
  productId: Schema.Types.ObjectId;
  image: string;
  color: string;
  size: string;
  quantity: number;
  _id: string;
}

export interface FavoritesDocument extends Document {
  userId: string;
  favorites: [Schema.Types.ObjectId];
}

export interface ItemDocument {
  productId: Schema.Types.ObjectId;
  color: string;
  size: string;
  quantity: number;
  variantId: string;
  price: number;
}

export interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: [string];
  image: [string];
  variants: [VariantsDocument];
  quantity: number;
  productId: Schema.Types.ObjectId;
  purchased: boolean;
}

export interface VariantsDocument {
  priceId: string;
  color: string;
  images: [string];
}

// Serialized version of ProductDocument for client components
export interface SerializedProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes?: string[];
  image: [string] | Array<{url: string; alt?: string}>;
  variants?: VariantsDocument[];
  quantity?: number;
  purchased?: boolean;
  productId?: string; // For compatibility with cart components
}

// Vachetta-specific types
export interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  phone: string;
  address?: AddressDocument;
  image?: string;
  profilePicture?: {
    url: string;
    publicId: string;
  };
  role: 'customer' | 'admin';
  shippingAddresses: ShippingAddress[];
  preferences: {
    emailNotifications: boolean;
    orderUpdates: boolean;
    promotionalEmails: boolean;
  };
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  lastLogin?: Date;
  isActive: boolean;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingAddress {
  name?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone?: string;
  isDefault: boolean;
}

export interface CustomizationOption {
  type: 'leather_type' | 'thread_color' | 'hardware_finish' | 'monogram';
  name: string;
  value: string;
  priceAdjustment: number;
  available: boolean;
}

export interface LeatherProductDocument extends Document {
  name: string;
  description: string;
  category: 'bags' | 'wallets' | 'belts' | 'accessories' | 'custom';
  subcategory?: string;
  basePrice: number;
  images: Array<{
    url: string;
    publicId: string;
    alt: string;
  }>;
  videos: Array<{
    url: string;
    publicId: string;
    description: string;
  }>;
  customizationOptions: CustomizationOption[];
  specifications: {
    dimensions: {
      length?: number;
      width?: number;
      height?: number;
      unit: string;
    };
    weight: {
      value?: number;
      unit: string;
    };
    materials: string[];
  };
  craftingTime: number;
  stockQuantity: number;
  isCustomizable: boolean;
  isActive: boolean;
  tags: string[];
  reviews: Array<{
    userId: Schema.Types.ObjectId;
    rating: number;
    comment: string;
    verified: boolean;
    createdAt: Date;
  }>;
  averageRating: number;
  totalReviews: number;
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierDocument extends Document {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  specialties: Array<'leather_hides' | 'exotic_leather' | 'hardware' | 'threads' | 'dyes' | 'tools' | 'finishing_materials'>;
  certifications: string[];
  paymentTerms: 'net_30' | 'net_60' | 'net_90' | 'cash_on_delivery' | 'advance_payment';
  rating: number;
  notes?: string;
  isActive: boolean;
  contracts: Array<{
    contractNumber?: string;
    startDate?: Date;
    endDate?: Date;
    terms?: string;
    isActive: boolean;
  }>;
  performanceMetrics: {
    onTimeDelivery: number;
    qualityScore: number;
    totalOrders: number;
    totalValue: number;
  };
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface RawMaterialDocument extends Document {
  name: string;
  type: 'leather_hide' | 'thread' | 'hardware' | 'dye' | 'finish' | 'tool' | 'other';
  supplier: Schema.Types.ObjectId;
  description: string;
  specifications: {
    grade?: string;
    origin?: string;
    thickness?: number;
    color?: string;
    size?: {
      length?: number;
      width?: number;
      unit?: string;
    };
  };
  currentStock: number;
  minimumStock: number;
  unitCost: number;
  unit: 'piece' | 'meter' | 'kg' | 'gram' | 'yard' | 'square_meter';
  processingStages: Array<{
    stage: 'received' | 'quality_check' | 'tanning' | 'dyeing' | 'finishing' | 'ready_for_use';
    date: Date;
    notes?: string;
    processedBy: string;
  }>;
  currentStage: 'received' | 'quality_check' | 'tanning' | 'dyeing' | 'finishing' | 'ready_for_use';
  qualityRating?: number;
  isActive: boolean;
  lastReplenished: Date;
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderDocument extends Document {
  poNumber: string;
  supplier: Schema.Types.ObjectId;
  items: Array<{
    material: Schema.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'partial_delivery' | 'delivered' | 'cancelled';
  orderDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  shippingAddress: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  terms?: string;
  notes?: string;
  deliveries: Array<{
    deliveryDate: Date;
    items: Array<{
      material: Schema.Types.ObjectId;
      quantityDelivered?: number;
      condition: 'excellent' | 'good' | 'acceptable' | 'poor';
      notes?: string;
    }>;
    receivedBy?: string;
    qualityCheck: {
      passed?: boolean;
      notes?: string;
      checkedBy?: string;
    };
  }>;
  createdBy: string;
  approvedBy?: string;
  approvalDate?: Date;
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CouponDocument extends Document {
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usageCount: number;
  userUsageLimit: number;
  applicableProducts: Schema.Types.ObjectId[];
  applicableCategories: string[];
  isActive: boolean;
  createdBy: string;
  usedBy: Array<{
    userId: Schema.Types.ObjectId;
    orderId: Schema.Types.ObjectId;
    usedAt: Date;
    discountApplied?: number;
  }>;
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomConfiguration {
  leatherType: string;
  threadColor: string;
  hardwareFinish: string;
  monogram?: {
    text?: string;
    font?: string;
    placement?: string;
  };
  additionalOptions: Array<{
    option?: string;
    value?: string;
    priceAdjustment?: number;
  }>;
  totalCustomizationCost: number;
}

export interface VachettaOrderDocument extends Document {
  orderNumber: string;
  customer: Schema.Types.ObjectId;
  items: Array<{
    product: Schema.Types.ObjectId;
    quantity: number;
    basePrice: number;
    isCustomized: boolean;
    customConfiguration?: CustomConfiguration;
    totalPrice: number;
    craftingStatus: 'pending' | 'in_progress' | 'quality_check' | 'completed' | 'shipped';
    estimatedCompletionDate?: Date;
    actualCompletionDate?: Date;
  }>;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone?: string;
  };
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  couponUsed?: {
    code?: string;
    discountApplied?: number;
  };
  totalAmount: number;
  paymentMethod: 'stripe' | 'razorpay' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentIntentId?: string;
  orderStatus: 'pending' | 'confirmed' | 'in_production' | 'quality_check' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: Array<{
    status?: string;
    timestamp: Date;
    notes?: string;
    updatedBy?: string;
  }>;
  trackingInfo?: {
    carrier?: string;
    trackingNumber?: string;
    shippedDate?: Date;
    estimatedDeliveryDate?: Date;
    actualDeliveryDate?: Date;
  };
  notes?: string;
  specialInstructions?: string;
  craftingNotes?: string;
  qualityCheckNotes?: string;
  isGift: boolean;
  giftMessage?: string;
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
