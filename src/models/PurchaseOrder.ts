import { Schema, model, models } from "mongoose";

// Purchase Order schema for B2B procurement
const PurchaseOrderSchema = new Schema(
  {
    poNumber: {
      type: String,
      required: true,
      unique: true
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true
    },
    items: [{
      material: {
        type: Schema.Types.ObjectId,
        ref: 'RawMaterial',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0
      },
      totalPrice: {
        type: Number,
        required: true
      }
    }],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'confirmed', 'partial_delivery', 'delivered', 'cancelled'],
      default: 'draft'
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    expectedDeliveryDate: {
      type: Date,
      required: true
    },
    actualDeliveryDate: Date,
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    terms: String,
    notes: String,
    deliveries: [{
      deliveryDate: {
        type: Date,
        default: Date.now
      },
      items: [{
        material: {
          type: Schema.Types.ObjectId,
          ref: 'RawMaterial'
        },
        quantityDelivered: Number,
        condition: {
          type: String,
          enum: ['excellent', 'good', 'acceptable', 'poor'],
          default: 'good'
        },
        notes: String
      }],
      receivedBy: String,
      qualityCheck: {
        passed: Boolean,
        notes: String,
        checkedBy: String
      }
    }],
    createdBy: {
      type: String,
      required: true
    },
    approvedBy: String,
    approvalDate: Date
  },
  {
    timestamps: true
  }
);

// Auto-generate PO number if not provided
PurchaseOrderSchema.pre('save', async function(next) {
  if (!this.poNumber) {
    const count = await this.constructor.countDocuments();
    this.poNumber = `PO-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  
  // Calculate total amount
  this.totalAmount = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  next();
});

const PurchaseOrder = models.PurchaseOrder || model("PurchaseOrder", PurchaseOrderSchema);
export default PurchaseOrder;
