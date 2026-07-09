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
      enum: ["unpaid", "paid", "pending", "failed", "refunded"], // ✅ Added "pending", "failed", "refunded"
      default: "pending", // ✅ Changed default to "pending"
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