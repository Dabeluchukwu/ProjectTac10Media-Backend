// Express router
const express = require("express");

// Import controller functions
const {
  create,
  getAll,
  getSingle,
  update,
  remove,
  getAdminAllCourses,
  togglePublishStatus,
  getInstructorCourses,
  getInstructorStudents, 
} = require("./courseController");

// Middleware to protect routes
const authMiddleware = require("../middlewares/authMiddleware");

// Middleware for role checking
const authorizeRoles = require("../middlewares/roleMiddleware");

// Create router
const router = express.Router();

// ==============================
// Public Routes
// ==============================

// Get all published courses
router.get("/", getAll);

// ==============================
// Protected Routes - Specific paths FIRST
// ==============================

// ✅ Get instructor's courses
router.get(
  "/instructor",
  authMiddleware,
  authorizeRoles("instructor", "admin", "superAdmin"),
  getInstructorCourses,
);

// ✅ Get instructor's students
router.get(
  "/instructor/students",
  authMiddleware,
  authorizeRoles("instructor", "admin", "superAdmin"),
  getInstructorStudents,
);

// ✅ Get all courses for admin (including drafts)
router.get(
  "/admin/all",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  getAdminAllCourses,
);

// ==============================
// Protected Routes - Generic paths LAST
// ==============================

// Get single course - MUST BE AFTER specific routes
router.get("/:id", getSingle);

// Create course
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "instructor", "superAdmin"),
  create,
);

// Update course (both PUT and PATCH)
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "instructor", "superAdmin"),
  update,
);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "instructor", "superAdmin"),
  update,
);

// Delete course (admin only)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  remove,
);

// Toggle publish status
router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("admin", "instructor", "superAdmin"),
  togglePublishStatus,
);

module.exports = router;