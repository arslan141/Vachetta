import { Schema, model, models } from "mongoose";

// Custom configuration for leather products
const CustomConfigurationSchema = new Schema({
  leatherType: {
    type: String,
    required: true
  },
  threadColor: {
    type: String,
    required: true
  },
  hardwareFinish: {
    type: String,
    required: true
  },
  monogram: {
    text: String,
    font: String,
    placement: String
  },
  additionalOptions: [{
    option: String,
    value: String,
    priceAdjustment: Number
  }],
  totalCustomizationCost: {
    type: Number,
    default: 0
  }
});

// Vachetta Order schema
const VachettaOrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'LeatherProduct',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      basePrice: {
        type: Number,
        required: true
      },
      isCustomized: {
        type: Boolean,
        default: false
      },
      customConfiguration: CustomConfigurationSchema,
      totalPrice: {
        type: Number,
        required: true
      },
      craftingStatus: {
        type: String,
        enum: ['pending', 'in_progress', 'quality_check', 'completed', 'shipped'],
        default: 'pending'
      },
      estimatedCompletionDate: Date,
      actualCompletionDate: Date
    }],
    shippingAddress: {
      name: {
        type: String,
        required: true
      },
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      phone: String
    },
    subtotal: {
      type: Number,
      required: true
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    couponUsed: {
      code: String,
      discountApplied: Number
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'razorpay', 'cash_on_delivery'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentIntentId: String,
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'in_production', 'quality_check', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    statusHistory: [{
      status: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      notes: String,
      updatedBy: String
    }],
    trackingInfo: {
      carrier: String,
      trackingNumber: String,
      shippedDate: Date,
      estimatedDeliveryDate: Date,
      actualDeliveryDate: Date
    },
    notes: String,
    specialInstructions: String,
    craftingNotes: String,
    qualityCheckNotes: String,
    isGift: {
      type: Boolean,
      default: false
    },
    giftMessage: String
  },
  {
    timestamps: true
  }
);

// Auto-generate order number if not provided
VachettaOrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    const orderDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    this.orderNumber = `VAC-${orderDate}-${(count + 1).toString().padStart(4, '0')}`;
  }
  
  // Calculate totals
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.totalAmount = this.subtotal + this.taxAmount + this.shippingCost - this.discountAmount;
  
  next();
});

const VachettaOrder = models.VachettaOrder || model("VachettaOrder", VachettaOrderSchema);
export default VachettaOrder;
