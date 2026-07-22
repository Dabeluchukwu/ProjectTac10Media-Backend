const mongoose = require("mongoose");

// Registration schema stores students enrolled in courses
const registrationSchema = new mongoose.Schema(
  {
    // Student who registered
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Course the student registered for
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // Registration status
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled", "active", "completed"],
      default: "pending",
    },

    // Payment tracking
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "pending", "failed", "refunded"],
      default: "pending",
    },

    // Amount paid
    amount: {
      type: Number,
      default: 0,
    },

    // Payment reference (for tracking)
    paymentReference: {
      type: String,
      default: null,
    },

    paystackReference: {
      type: String,
      default: null,
    },

    // ✅ Add paymentMethod field (same as Booking)
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

const Registration = mongoose.model("Registration", registrationSchema);
module.exports = Registration;