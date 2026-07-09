const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getAdminAnalytics,
  getRevenueChartData,
  getEnrollmentChartData,
  getBookingChartData,
  getInstructorStats,
  getInstructorAnalytics,
  getPlatformStats,
  getUserGrowthChartData,
  getPlatformAnalytics 
} = require("./dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// ==============================
// Super Admin Routes
// ==============================

// Get platform stats (Super Admin only)
router.get(
  "/platform",
  authMiddleware,
  authorizeRoles("superAdmin"),
  getPlatformStats
);

// ✅ Get platform analytics (Super Admin only)
router.get(
  "/platform/analytics",
  authMiddleware,
  authorizeRoles("superAdmin"),
  getPlatformAnalytics
);

// ==============================
// Admin Routes
// ==============================

// Get admin dashboard stats
router.get(
  "/admin",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  getAdminStats
);

// Get admin analytics
router.get(
  "/admin/analytics",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  getAdminAnalytics
);

// ==============================
// Instructor Routes
// ==============================

// Get instructor dashboard stats
router.get(
  "/instructor",
  authMiddleware,
  authorizeRoles("instructor", "admin", "superAdmin"),
  getInstructorStats
);

// Get instructor analytics
router.get(
  "/instructor/analytics",
  authMiddleware,
  authorizeRoles("instructor", "admin", "superAdmin"),
  getInstructorAnalytics
);

// ==============================
// Chart Routes
// ==============================

// Get revenue chart data
router.get(
  "/charts/revenue",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  getRevenueChartData
);

// Get enrollment chart data
router.get(
  "/charts/enrollments",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  getEnrollmentChartData
);

// Get booking chart data
router.get(
  "/charts/bookings",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  getBookingChartData
);

// ✅ User growth chart route
router.get(
  "/charts/users",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  getUserGrowthChartData
);

module.exports = router;