const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,

      trim: true,
    },

    slug: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,
    },

    description: {
      type: String,

      required: true,

      trim: true,
    },

    image: {
      type: String,

      default: null,
    },

    category: {
      type: String,

      default: "production",

      trim: true,
    },

    price: {
      type: Number,

      required: true,

      min: 0,
    },

    currency: {
      type: String,

      default: "NGN",

      uppercase: true,
    },

    duration: {
      type: String,

      default: null,
    },

    isActive: {
      type: Boolean,

      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },
  },

  {
    timestamps: true,
  },
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
