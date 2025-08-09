import { Schema, model, models } from "mongoose";

// Raw material schema for B2B procurement
const RawMaterialSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Material name is required"],
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['leather_hide', 'thread', 'hardware', 'dye', 'finish', 'tool', 'other']
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true
    },
    description: {
      type: String,
      required: true
    },
    specifications: {
      grade: String,
      origin: String,
      thickness: Number, // for leather
      color: String,
      size: {
        length: Number,
        width: Number,
        unit: String
      }
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0
    },
    minimumStock: {
      type: Number,
      required: true,
      min: 0
    },
    unitCost: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      enum: ['piece', 'meter', 'kg', 'gram', 'yard', 'square_meter']
    },
    processingStages: [{
      stage: {
        type: String,
        required: true,
        enum: ['received', 'quality_check', 'tanning', 'dyeing', 'finishing', 'ready_for_use']
      },
      date: {
        type: Date,
        default: Date.now
      },
      notes: String,
      processedBy: {
        type: String,
        required: true
      }
    }],
    currentStage: {
      type: String,
      enum: ['received', 'quality_check', 'tanning', 'dyeing', 'finishing', 'ready_for_use'],
      default: 'received'
    },
    qualityRating: {
      type: Number,
      min: 1,
      max: 5
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastReplenished: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Auto-update current stage based on latest processing stage
RawMaterialSchema.pre('save', function(next) {
  if (this.processingStages && this.processingStages.length > 0) {
    const latestStage = this.processingStages[this.processingStages.length - 1];
    this.currentStage = latestStage.stage;
  }
  next();
});

const RawMaterial = models.RawMaterial || model("RawMaterial", RawMaterialSchema);
export default RawMaterial;
