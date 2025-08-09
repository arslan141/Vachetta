import { Schema, model, models } from "mongoose";

// Supplier schema for B2B procurement
const SupplierSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ]
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"]
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    specialties: [{
      type: String,
      enum: ['leather_hides', 'exotic_leather', 'hardware', 'threads', 'dyes', 'tools', 'finishing_materials']
    }],
    certifications: [String],
    paymentTerms: {
      type: String,
      enum: ['net_30', 'net_60', 'net_90', 'cash_on_delivery', 'advance_payment'],
      default: 'net_30'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    notes: String,
    isActive: {
      type: Boolean,
      default: true
    },
    contracts: [{
      contractNumber: String,
      startDate: Date,
      endDate: Date,
      terms: String,
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    performanceMetrics: {
      onTimeDelivery: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      qualityScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      totalOrders: {
        type: Number,
        default: 0
      },
      totalValue: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

const Supplier = models.Supplier || model("Supplier", SupplierSchema);
export default Supplier;
