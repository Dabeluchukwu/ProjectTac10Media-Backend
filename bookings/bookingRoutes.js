const express = require("express");

const {
  create,
  getMyBookings,
  getSingleBooking,
  update,
  remove,
  getAdminAllBookings,
  updateAdminBookingStatus,
   updateProgress,
} = require("./bookingController");

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

// ==============================
// CLIENT ROUTES
// ==============================

// Client creates booking
router.post(
  "/",
  authMiddleware,
  create,
);

// Client gets own bookings
router.get(
  "/",
  authMiddleware,
  getMyBookings,
);

// Get single booking
router.get(
  "/:id",
  authMiddleware,
  getSingleBooking,
);

// Client update booking details
router.patch(
  "/:id",
  authMiddleware,
  update,
);

// Delete booking
router.delete(
  "/:id",
  authMiddleware,
  remove,
);

// ==============================
// ADMIN ROUTES
// ==============================

// ✅ Get all bookings (admin)
router.get(
  "/admin/all",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  getAdminAllBookings,
);

// ✅ Update booking status (admin)
router.patch(
  "/admin/:id/status",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  updateAdminBookingStatus,
);


// ✅ Update booking progress (admin)
router.patch(
  "/admin/:id/progress",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  updateProgress,
);

module.exports = router;