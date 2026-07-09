const express = require("express");

const router = express.Router();

const {
  startCourseProgress,

  getMyCourseProgress,

  markLessonComplete,

  getCourseProgressList,
} = require("./progressController");

const authMiddleware = require("../middlewares/authMiddleware");

const authorizeRoles = require("../middlewares/roleMiddleware");

// ==============================
// Student Routes
// ==============================

// Start course progress

router.post(
  "/",

  authMiddleware,

  authorizeRoles(
    "student",

    "client",
  ),

  startCourseProgress,
);

// Get own course progress

router.get(
  "/my/:courseId",

  authMiddleware,

  authorizeRoles(
    "student",

    "client",
  ),

  getMyCourseProgress,
);

// Mark lesson completed

router.patch(
  "/:courseId/lesson",
  authMiddleware,
  authorizeRoles("student"),
  markLessonComplete
)

// ==============================
// Admin Routes
// ==============================

// View all student progress

router.get(
  "/",

  authMiddleware,

  authorizeRoles(
    "superAdmin",

    "admin",

    "instructor",
  ),

  getCourseProgressList,
);

module.exports = router;
