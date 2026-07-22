const mongoose = require("mongoose");

// Booking schema defines service/package booking records
const bookingSchema = new mongoose.Schema(
  {
    // Client who created booking
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // What the customer booked
    bookingType: {
      type: String,
      enum: ["service", "package"],
      required: true,
    },

    // Single production service
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },

    // Production service package
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePackage",
      default: null,
    },

    // Date of service
    bookingDate: {
      type: Date,
      required: true,
    },

    // Service location
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Client notes
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Booking workflow
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },

     // ✅ Production progress
    progress: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
    },

    // Snapshot price at booking time
    amount: {
      type: Number,
      default: 0,
    },

    // Currency snapshot
    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
    },

    // Payment tracking
paymentStatus: {
  type: String,
  enum: ["unpaid", "paid", "pending"], 
  default: "unpaid",
},
    paymentReference: {
      type: String,
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: ["paystack", "stripe", "manual"],
      default: "paystack",
    },

    

    paidAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// ✅ Fix: Remove the problematic pre-save hook with 'next'
// The validation is already handled in the service layer (bookingService.js)

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;