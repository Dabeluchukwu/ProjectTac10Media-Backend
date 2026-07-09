const mongoose = require("mongoose");

// Advertisement schema
const advertSchema = new mongoose.Schema(
  {
    // User/company that created advert
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    // Advert title
    title: {
      type: String,

      required: true,

      trim: true,
    },

    // Advert description
    description: {
      type: String,

      required: true,

      trim: true,
    },

    // Image/banner URL
    image: {
      type: String,

      required: true,
    },

    // Optional redirect link
    link: {
      type: String,

      default: null,
    },

    // Where advert appears
    type: {
      type: String,

      enum: ["course", "service", "general"],

      default: "general",
    },

    // Advertisement status
    status: {
      type: String,

      enum: ["active", "inactive"],

      default: "active",
    },

    // Advert expiration date
    expiresAt: {
      type: Date,
    },
  },

  {
    timestamps: true,
  },
);

const Advert = mongoose.model(
  "Advert",

  advertSchema,
);

module.exports = Advert;
