const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const ManualPayment = require("./manualPaymentModel");
const BankAccount = require("../bank/bankAccountModel");
const Booking = require("../bookings/bookingModel");
const Registration = require("../courseRegistration/registrationModel");
const User = require("../users/userModel");

// ==============================
// USER ROUTES
// ==============================

// User submits manual payment with receipt
const submitManualPayment = asyncHandler(async (req, res) => {
  console.log("🔍 Manual payment submission request:");
  console.log("  Body:", req.body);
  console.log("  User:", req.user.id);

  const {
    purpose,
    referenceId,
    receiptUrl,
    receiptPublicId,
    bankAccountId,
    notes,
  } = req.body;

  // Validate required fields
  if (!purpose || !referenceId || !receiptUrl) {
    console.error("❌ Missing required fields:", {
      purpose,
      referenceId,
      receiptUrl,
    });
    throw new ApiError(
      400,
      "Purpose, referenceId, and receiptUrl are required",
    );
  }

  let referenceModel;
  let amount;
  let targetDoc;

  // Find the booking or registration
  if (purpose === "booking") {
    const booking = await Booking.findById(referenceId);
    if (!booking) throw new ApiError(404, "Booking not found");
    if (booking.user.toString() !== req.user.id) {
      throw new ApiError(403, "You don't own this booking");
    }
    if (booking.paymentStatus === "paid") {
      throw new ApiError(400, "This booking is already paid");
    }
    referenceModel = "Booking";
    amount = booking.amount;
    targetDoc = booking;
  } else if (purpose === "course") {
    const registration = await Registration.findById(referenceId);
    if (!registration) throw new ApiError(404, "Registration not found");
    if (registration.student.toString() !== req.user.id) {
      throw new ApiError(403, "You don't own this registration");
    }
    if (registration.paymentStatus === "paid") {
      throw new ApiError(400, "This course is already paid");
    }
    referenceModel = "Registration";
    amount = registration.amount;
    targetDoc = registration;
  } else {
    throw new ApiError(400, "Invalid purpose. Must be 'booking' or 'course'");
  }

  // Check for existing pending payment
  const existing = await ManualPayment.findOne({
    referenceId,
    referenceModel,
    status: "pending",
  });
  if (existing) {
    // Update existing record instead of throwing error
    existing.receiptUrl = receiptUrl;
    existing.receiptPublicId = receiptPublicId || existing.receiptPublicId;
    existing.bankAccountUsed = bankAccountId || existing.bankAccountUsed;
    existing.notes = notes || existing.notes;
    await existing.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Manual payment updated successfully", existing),
      );
  }

  // Get bank account info (optional)
  let bankAccount = null;
  if (bankAccountId) {
    bankAccount = await BankAccount.findById(bankAccountId);
  }

  // Create manual payment record
  const manualPayment = await ManualPayment.create({
    user: req.user.id,
    purpose,
    referenceId,
    referenceModel,
    amount,
    receiptUrl,
    receiptPublicId: receiptPublicId || null,
    bankAccountUsed: bankAccountId || null,
    notes: notes || "",
    status: "pending",
  });

  // Update target document to pending
  targetDoc.paymentStatus = "pending";
  if (
    targetDoc.schema &&
    targetDoc.schema.paths &&
    targetDoc.schema.paths.paymentMethod
  ) {
    targetDoc.paymentMethod = "manual";
  }
  await targetDoc.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Manual payment submitted successfully",
        manualPayment,
      ),
    );
});

// Get user's manual payments
const getMyManualPayments = asyncHandler(async (req, res) => {
  const payments = await ManualPayment.find({ user: req.user.id })
    .populate("bankAccountUsed")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      new ApiResponse(200, "Manual payments fetched successfully", payments),
    );
});

// ==============================
// ADMIN ROUTES
// ==============================

// ✅ ADMIN: Get all pending manual payments
const getPendingManualPayments = asyncHandler(async (req, res) => {
  console.log("🔍 Fetching pending manual payments");
  const payments = await ManualPayment.find({ status: "pending" })
    .populate("user", "firstName lastName email")
    .populate("bankAccountUsed")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Pending manual payments fetched successfully",
        payments,
      ),
    );
});

// ✅ ADMIN: Get all manual payments (with filter)
const getAllManualPayments = asyncHandler(async (req, res) => {
  const { status } = req.query;
  console.log("🔍 Fetching all manual payments, filter:", status);

  const filter = status && status !== "all" ? { status } : {};
  const payments = await ManualPayment.find(filter)
    .populate("user", "firstName lastName email")
    .populate("bankAccountUsed")
    .populate("confirmedBy", "firstName lastName email")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      new ApiResponse(200, "Manual payments fetched successfully", payments),
    );
});

// ✅ ADMIN: Confirm manual payment
const confirmManualPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  console.log("🔍 Confirming manual payment:", id);

  const manualPayment = await ManualPayment.findById(id);
  if (!manualPayment) {
    throw new ApiError(404, "Manual payment not found");
  }
  if (manualPayment.status !== "pending") {
    throw new ApiError(400, `This payment is already ${manualPayment.status}`);
  }

  // Update manual payment
  manualPayment.status = "confirmed";
  manualPayment.confirmedBy = req.user.id;
  manualPayment.confirmedAt = new Date();
  if (notes) manualPayment.notes = notes;
  await manualPayment.save();

  // Update the booking or registration
  const Model =
    manualPayment.referenceModel === "Booking" ? Booking : Registration;
  const targetDoc = await Model.findById(manualPayment.referenceId);
  if (targetDoc) {
    // ✅ Update payment status
    targetDoc.paymentStatus = "paid";

    // ✅ Update the enrollment/booking status
    if (manualPayment.referenceModel === "Booking") {
      targetDoc.status = "confirmed";
    } else {
      targetDoc.status = "approved"; // or "active" for courses
    }

    // ✅ Set payment method if field exists
    if (
      targetDoc.schema &&
      targetDoc.schema.paths &&
      targetDoc.schema.paths.paymentMethod
    ) {
      targetDoc.paymentMethod = "manual";
    }

    targetDoc.paidAt = new Date();
    targetDoc.paymentReference = `MANUAL-${manualPayment._id}`;
    await targetDoc.save();
  }

  // ✅ Simple notification
  try {
    const user = await User.findById(manualPayment.user);
    if (user) {
      console.log(`📨 Payment confirmed for ${user.email}`);
    }
  } catch (notifError) {
    console.error("Notification error:", notifError);
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Manual payment confirmed successfully",
        manualPayment,
      ),
    );
});
// ✅ ADMIN: Reject manual payment
const rejectManualPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  console.log("🔍 Rejecting manual payment:", id);

  if (!rejectionReason) {
    throw new ApiError(400, "Rejection reason is required");
  }

  const manualPayment = await ManualPayment.findById(id);
  if (!manualPayment) {
    throw new ApiError(404, "Manual payment not found");
  }
  if (manualPayment.status !== "pending") {
    throw new ApiError(400, `This payment is already ${manualPayment.status}`);
  }

  // Update manual payment
  manualPayment.status = "rejected";
  manualPayment.confirmedBy = req.user.id;
  manualPayment.confirmedAt = new Date();
  manualPayment.rejectionReason = rejectionReason;
  await manualPayment.save();

  // Update the booking or registration back to unpaid
  const Model =
    manualPayment.referenceModel === "Booking" ? Booking : Registration;
  const targetDoc = await Model.findById(manualPayment.referenceId);
  if (targetDoc) {
    targetDoc.paymentStatus = "unpaid";
    if (
      targetDoc.schema &&
      targetDoc.schema.paths &&
      targetDoc.schema.paths.paymentMethod
    ) {
      targetDoc.paymentMethod = null;
    }
    await targetDoc.save();
  }

  // ✅ Simple notification (without formatCurrency)
  try {
    const user = await User.findById(manualPayment.user);
    if (user) {
      console.log(`📨 Payment rejected for ${user.email}: ${rejectionReason}`);
      // TODO: Implement actual email sending
      // await sendEmail(user.email, "Payment Rejected", `Your payment was rejected: ${rejectionReason}`);
    }
  } catch (notifError) {
    console.error("Notification error:", notifError);
    // Don't fail the request if notification fails
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Manual payment rejected successfully",
        manualPayment,
      ),
    );
});

module.exports = {
  submitManualPayment,
  getMyManualPayments,
  getPendingManualPayments,
  getAllManualPayments,
  confirmManualPayment,
  rejectManualPayment,
};
