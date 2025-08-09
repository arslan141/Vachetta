import { Schema, model, models } from "mongoose";

// Coupon schema for promotional offers
const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed_amount'],
      required: true
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    minimumOrderAmount: {
      type: Number,
      default: 0
    },
    maximumDiscount: {
      type: Number, // for percentage discounts
      default: null
    },
    validFrom: {
      type: Date,
      required: true
    },
    validUntil: {
      type: Date,
      required: true
    },
    usageLimit: {
      type: Number,
      default: null // null means unlimited
    },
    usageCount: {
      type: Number,
      default: 0
    },
    userUsageLimit: {
      type: Number,
      default: 1 // how many times one user can use this coupon
    },
    applicableProducts: [{
      type: Schema.Types.ObjectId,
      ref: 'LeatherProduct'
    }],
    applicableCategories: [String],
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: String,
      required: true
    },
    usedBy: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      orderId: {
        type: Schema.Types.ObjectId,
        ref: 'VachettaOrder'
      },
      usedAt: {
        type: Date,
        default: Date.now
      },
      discountApplied: Number
    }]
  },
  {
    timestamps: true
  }
);

// Validate coupon before saving
CouponSchema.pre('save', function(next) {
  if (this.validFrom >= this.validUntil) {
    next(new Error('Valid from date must be before valid until date'));
  }
  
  if (this.discountType === 'percentage' && this.discountValue > 100) {
    next(new Error('Percentage discount cannot exceed 100%'));
  }
  
  next();
});

const Coupon = models.Coupon || model("Coupon", CouponSchema);
export default Coupon;
