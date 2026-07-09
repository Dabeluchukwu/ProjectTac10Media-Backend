const mongoose = require("mongoose");

// Discount schema
const discountSchema = new mongoose.Schema(
  {
    // Person who created discount
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    // Discount code
    // Example: CINEMA20
    code: {
      type: String,

      required: true,

      unique: true,

      uppercase: true,

      trim: true,
    },

    // Discount type
    type: {
      type: String,

      enum: ["percentage", "fixed"],

      required: true,
    },

    // Discount value
    // Example:
    // 20 for 20%
    // 5000 for ₦5000
    value: {
      type: Number,

      required: true,
    },

    // Maximum number of times used
    usageLimit: {
      type: Number,

      default: null,
    },

    // Number of times used
    usedCount: {
      type: Number,

      default: 0,
    },

    // Expiration date
    expiresAt: {
      type: Date,

      required: true,
    },

    // Active status
    status: {
      type: String,

      enum: ["active", "inactive"],

      default: "active",
    },
  },

  {
    timestamps: true,
  },
);

const Discount = mongoose.model(
  "Discount",

  discountSchema,
);

module.exports = Discount;
