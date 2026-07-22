const express = require("express");
const {
  submitManualPayment,
  getMyManualPayments,
  getPendingManualPayments,
  getAllManualPayments,
  confirmManualPayment,
  rejectManualPayment,
} = require("./manualPaymentController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

// User routes
router.post("/submit", authMiddleware, submitManualPayment);
router.get("/my-payments", authMiddleware, getMyManualPayments);

// Admin routes
router.get(
  "/admin/pending",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  getPendingManualPayments
);
router.get(
  "/admin/all",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  getAllManualPayments
);
router.patch(
  "/admin/:id/confirm",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  confirmManualPayment
);
router.patch(
  "/admin/:id/reject",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  rejectManualPayment
);

module.exports = router;