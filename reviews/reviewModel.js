const mongoose = require("mongoose");

// Review schema stores ratings and feedback
const reviewSchema = new mongoose.Schema(
  {
    // Person leaving the review
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    // What is being reviewed
    // Example: course, service, instructor
    targetType: {
      type: String,

      enum: ["course", "service", "user"],

      required: true,
    },

    // ID of the item being reviewed
    targetId: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,
    },

    // Rating from 1 - 5
    rating: {
      type: Number,

      min: 1,

      max: 5,

      required: true,
    },

    // Review message
    comment: {
      type: String,

      required: true,

      trim: true,
    },
  },

  {
    timestamps: true,
  },
);

const Review = mongoose.model(
  "Review",

  reviewSchema,
);

module.exports = Review;
