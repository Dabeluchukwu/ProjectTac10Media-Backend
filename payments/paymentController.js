// const asyncHandler = require("../utils/asyncHandler");
// const ApiResponse = require("../utils/ApiResponse");
// const { initializePayment, verifyPayment, getMyPayments } = require("./paymentService");

// // Initialize payment
// const initialize = asyncHandler(async (req, res) => {
//   console.log("🔍 Payment Controller - initialize called");
//   console.log("  User ID:", req.user?.id);
//   console.log("  Request Body:", req.body);
  
//   const { registrationId } = req.body;

//   if (!registrationId) {
//     console.log("❌ No registrationId provided");
//     return res.status(400).json({
//       success: false,
//       message: "Registration ID is required",
//     });
//   }

//   console.log("✅ Registration ID received:", registrationId);
  
//   const result = await initializePayment(req.user.id, req.body);

//   console.log("✅ Payment initialized successfully");
//   console.log("  Authorization URL:", result?.authorizationUrl);
  
//   res.status(200).json(
//     new ApiResponse(200, "Payment initialized successfully", result)
//   );
// });

// // Verify payment (frontend callback)
// const verify = asyncHandler(async (req, res) => {
//   console.log("🔍 Payment Controller - verify called");
//   console.log("  Reference:", req.params.reference);
  
//   const { reference } = req.params;

//   if (!reference) {
//     return res.status(400).json({
//       success: false,
//       message: "Payment reference is required",
//     });
//   }

//   const result = await verifyPayment(reference);

//   console.log("✅ Payment verified successfully");
  
//   res.status(200).json(
//     new ApiResponse(200, "Payment verified successfully", result)
//   );
// });

// // Get logged-in user's payments
// const getMine = asyncHandler(async (req, res) => {
//   console.log("🔍 Payment Controller - getMine called");
//   console.log("  User ID:", req.user?.id);
  
//   const payments = await getMyPayments(req.user.id);

//   res.status(200).json(
//     new ApiResponse(200, "Payments fetched successfully", payments)
//   );
// });

// module.exports = {
//   initialize,
//   verify,
//   getMine,
// };


// NEW VERSION AFTER CREATING BOOKINGS


// const asyncHandler = require("../utils/asyncHandler");
// const ApiResponse = require("../utils/ApiResponse");
// const { initializePayment, verifyPayment, getMyPayments,   getAllPaymentsService } = require("./paymentService");

// // Initialize payment
// const initialize = asyncHandler(async (req, res) => {
//   console.log("🔍 Payment Controller - initialize called");
//   console.log("  User ID:", req.user?.id);
//   console.log("  Request Body:", req.body);
  
//   const { registrationId, bookingId } = req.body;

//   // ✅ Check if either registrationId or bookingId is provided
//   if (!registrationId && !bookingId) {
//     console.log("❌ No registrationId or bookingId provided");
//     return res.status(400).json({
//       success: false,
//       message: "Either Registration ID or Booking ID is required",
//     });
//   }

//   // ✅ If purpose is booking but no bookingId
//   if (req.body.purpose === "booking" && !bookingId) {
//     console.log("❌ No bookingId provided for booking payment");
//     return res.status(400).json({
//       success: false,
//       message: "Booking ID is required for booking payment",
//     });
//   }

//   // ✅ If purpose is course but no registrationId
//   if (req.body.purpose === "course" && !registrationId) {
//     console.log("❌ No registrationId provided for course payment");
//     return res.status(400).json({
//       success: false,
//       message: "Registration ID is required for course payment",
//     });
//   }

//   console.log("✅ Payment initialization proceeding...");
  
//   const result = await initializePayment(req.user.id, req.body);

//   console.log("✅ Payment initialized successfully");
//   console.log("  Authorization URL:", result?.authorizationUrl);
  
//   res.status(200).json(
//     new ApiResponse(200, "Payment initialized successfully", result)
//   );
// });

// // Verify payment (frontend callback)
// const verify = asyncHandler(async (req, res) => {
//   console.log("🔍 Payment Controller - verify called");
//   console.log("  Reference:", req.params.reference);
  
//   const { reference } = req.params;

//   if (!reference) {
//     return res.status(400).json({
//       success: false,
//       message: "Payment reference is required",
//     });
//   }

//   const result = await verifyPayment(reference);

//   console.log("✅ Payment verified successfully");
  
//   res.status(200).json(
//     new ApiResponse(200, "Payment verified successfully", result)
//   );
// });

// // Get logged-in user's payments
// const getMine = asyncHandler(async (req, res) => {
//   console.log("🔍 Payment Controller - getMine called");
//   console.log("  User ID:", req.user?.id);
  
//   const payments = await getMyPayments(req.user.id);

//   res.status(200).json(
//     new ApiResponse(200, "Payments fetched successfully", payments)
//   );
// });



// // ✅ Get all payments (admin)
// const getAllPayments = asyncHandler(async (req, res) => {
//   console.log("🔍 Payment Controller - getAllPayments called");
  
//   const payments = await getAllPaymentsService();

//   res.status(200).json(
//     new ApiResponse(200, "All payments fetched successfully", payments)
//   );
// });

// module.exports = {
//   initialize,
//   verify,
//   getMine,
//   getAllPayments
// };


const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { initializePayment, verifyPayment, getMyPayments, getAllPaymentsService } = require("./paymentService");

// Initialize payment
const initialize = asyncHandler(async (req, res) => {
  console.log("🔍 Payment Controller - initialize called");
  console.log("  User ID:", req.user?.id);
  console.log("  Request Body:", req.body);
  
  const { registrationId, bookingId, purpose } = req.body;

  // ✅ Check if either registrationId or bookingId is provided
  if (!registrationId && !bookingId) {
    console.log("❌ No registrationId or bookingId provided");
    return res.status(400).json({
      success: false,
      message: "Either Registration ID or Booking ID is required",
    });
  }

  // ✅ If purpose is booking but no bookingId
  if (purpose === "booking" && !bookingId) {
    console.log("❌ No bookingId provided for booking payment");
    return res.status(400).json({
      success: false,
      message: "Booking ID is required for booking payment",
    });
  }

  // ✅ If purpose is course but no registrationId
  if (purpose === "course" && !registrationId) {
    console.log("❌ No registrationId provided for course payment");
    return res.status(400).json({
      success: false,
      message: "Registration ID is required for course payment",
    });
  }

  console.log("✅ Payment initialization proceeding...");
  
  // ✅ Add callback_url to the request data
  const paymentData = {
    ...req.body,
    callbackUrl: process.env.PAYSTACK_CALLBACK_URL || "https://project-tac10-media-frontend.vercel.app/payment/verify",
  };
  
  const result = await initializePayment(req.user.id, paymentData);

  console.log("✅ Payment initialized successfully");
  console.log("  Authorization URL:", result?.authorizationUrl);
  
  res.status(200).json(
    new ApiResponse(200, "Payment initialized successfully", result)
  );
});

// Verify payment (frontend callback)
const verify = asyncHandler(async (req, res) => {
  console.log("🔍 Payment Controller - verify called");
  console.log("  Reference:", req.params.reference);
  
  const { reference } = req.params;

  if (!reference) {
    return res.status(400).json({
      success: false,
      message: "Payment reference is required",
    });
  }

  const result = await verifyPayment(reference);

  console.log("✅ Payment verified successfully");
  
  res.status(200).json(
    new ApiResponse(200, "Payment verified successfully", result)
  );
});

// Get logged-in user's payments
const getMine = asyncHandler(async (req, res) => {
  console.log("🔍 Payment Controller - getMine called");
  console.log("  User ID:", req.user?.id);
  
  const payments = await getMyPayments(req.user.id);

  res.status(200).json(
    new ApiResponse(200, "Payments fetched successfully", payments)
  );
});

// ✅ Get all payments (admin)
const getAllPayments = asyncHandler(async (req, res) => {
  console.log("🔍 Payment Controller - getAllPayments called");
  
  const payments = await getAllPaymentsService();

  res.status(200).json(
    new ApiResponse(200, "All payments fetched successfully", payments)
  );
});

module.exports = {
  initialize,
  verify,
  getMine,
  getAllPayments
};