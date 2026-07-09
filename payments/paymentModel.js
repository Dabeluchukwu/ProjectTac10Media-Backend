const mongoose = require("mongoose");

// Payment schema
const paymentSchema = new mongoose.Schema(
  {
    // User who made payment
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    // Payment purpose
    purpose: {
      type: String,

      enum: ["course", "booking", "advertisement", "other"],

      required: true,
    },

    // General reference ID
    // Example:
    // bookingId
    // registrationId
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,
    },

    // Booking relationship
    booking: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Booking",

      default: null,
    },

    registration: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Registration",

      default: null,
    },

    // Paystack transaction reference
    paystackReference: {
      type: String,

      unique: true,

      required: true,
    },

    // Amount sent to Paystack (kobo)
    amount: {
      type: Number,

      required: true,
    },

    // Payment status
    status: {
      type: String,

      enum: ["pending", "success", "failed"],

      default: "pending",
    },
  },

  {
    timestamps: true,
  },
);

const Payment = mongoose.model(
  "Payment",

  paymentSchema,
);

module.exports = Payment;
