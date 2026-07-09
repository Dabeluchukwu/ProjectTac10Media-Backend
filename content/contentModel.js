const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    // Page name
    // Example:
    // home
    // about
    // courses
    page: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,
    },

    // All editable frontend sections
    sections: {
      type: mongoose.Schema.Types.Mixed,

      default: {},
    },

    // SEO information
    meta: {
      title: String,

      description: String,

      keywords: [String],
    },

    // Track who edited content
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },

    // Control visibility
    isPublished: {
      type: Boolean,

      default: false,
    },
  },

  {
    timestamps: true,
  },
);

const Content = mongoose.model(
  "Content",

  contentSchema,
);

module.exports = Content;
