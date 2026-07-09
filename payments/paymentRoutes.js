// Express router
const express = require("express");

const {
  initialize,

  verify,

  getMine,
   getAllPayments,
} = require("./paymentController");

const paystackWebhook = require("./paystackWebhook");

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

// Add this at the top of payment.routes.js
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Payment routes are working!" });
});

// Initialize payment
router.post(
  "/initialize",

  authMiddleware,

  initialize,
);

// Verify payment manually
router.get(
  "/verify/:reference",

  verify,
);

// Paystack webhook
// No authentication middleware
router.post(
  "/webhook",

  paystackWebhook,
);

// User payment history
router.get(
  "/my-payments",

  authMiddleware,

  getMine,
);

// ✅ Admin - Get all payments
router.get(
  "/admin/all",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  getAllPayments,
);

module.exports = router;
