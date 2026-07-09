const mongoose = require("mongoose");

const bundleSchema = new mongoose.Schema(
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

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Course",

        required: true,
      },
    ],

    price: {
      type: Number,

      required: true,

      min: 0,
    },

    currency: {
      type: String,

      default: "USD",

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

const CourseBundle = mongoose.model(
  "CourseBundle",

  bundleSchema,
);

module.exports = CourseBundle;
