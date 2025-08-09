import { Schema, model, models } from "mongoose";

// Customization options for leather products
const CustomizationOptionSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['leather_type', 'thread_color', 'hardware_finish', 'monogram']
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  priceAdjustment: {
    type: Number,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  }
});

// Leather product schema
const LeatherProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Product description is required"]
    },
    category: {
      type: String,
      required: true,
      enum: ['bags', 'wallets', 'belts', 'accessories', 'custom']
    },
    subcategory: {
      type: String,
      required: false
    },
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"]
    },
    images: [{
      url: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      },
      alt: {
        type: String,
        default: ""
      }
    }],
    videos: [{
      url: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: ""
      }
    }],
    customizationOptions: [CustomizationOptionSchema],
    specifications: {
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
          type: String,
          default: "cm"
        }
      },
      weight: {
        value: Number,
        unit: {
          type: String,
          default: "g"
        }
      },
      materials: [String]
    },
    craftingTime: {
      type: Number, // in days
      default: 7
    },
    stockQuantity: {
      type: Number,
      default: 0
    },
    isCustomizable: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    tags: [String],
    reviews: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        required: true
      },
      verified: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    averageRating: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Calculate average rating before saving
LeatherProductSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
    this.totalReviews = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }
  next();
});

const LeatherProduct = models.LeatherProduct || model("LeatherProduct", LeatherProductSchema);
export default LeatherProduct;
