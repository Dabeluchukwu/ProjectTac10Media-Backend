const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
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

    services: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Service",

        required: true,
      },
    ],
     features: {
      type: [String],
      default: [],
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

const ServicePackage = mongoose.model(
  "ServicePackage",

  packageSchema,
);

module.exports = ServicePackage;
