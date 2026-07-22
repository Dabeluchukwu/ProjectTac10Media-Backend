const mongoose = require("mongoose");

const manualPaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purpose: {
      type: String,
      enum: ["course", "booking"],
      required: true,
    },
    // Reference to Booking or Registration
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "referenceModel",
    },
    referenceModel: {
      type: String,
      enum: ["Booking", "Registration"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    receiptUrl: {
      type: String,
      required: true,
    },
    receiptPublicId: {
      type: String,
    },
    bankAccountUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ManualPayment", manualPaymentSchema);