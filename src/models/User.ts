import { UserDocument } from "@/types/types";
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Full name is required"],
      minLength: [3, "Full name must be at least 3 characters"],
      maxLength: [50, "Full name must be at most 50 characters"],
    },
    phone: {
      type: String,
      default: "",
    },
    profilePicture: {
      url: String,
      publicId: String
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    shippingAddresses: [{
      name: String,
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
      phone: String,
      isDefault: {
        type: Boolean,
        default: false
      }
    }],
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      orderUpdates: {
        type: Boolean,
        default: true
      },
      promotionalEmails: {
        type: Boolean,
        default: false
      }
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpiry: Date,
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  },
);

const User = models.User || model<UserDocument>("User", UserSchema);
export default User;
