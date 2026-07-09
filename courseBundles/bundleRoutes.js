const express = require("express");

const router = express.Router();

const {
  createCourseBundle,

  getAllCourseBundles,

  getSingleCourseBundle,

  updateCourseBundle,

  removeCourseBundle,
} = require("./bundleController");

const authMiddleware = require("../middlewares/authMiddleware");

const authorizeRoles = require("../middlewares/roleMiddleware");

// ==============================
// Public Routes
// ==============================

// Get all course bundles

router.get(
  "/",

  getAllCourseBundles,
);

// Get single course bundle

router.get(
  "/:id",

  getSingleCourseBundle,
);

// ==============================
// Admin Routes
// ==============================

// Create course bundle

router.post(
  "/",

  authMiddleware,

  authorizeRoles(
    "superAdmin",

    "admin",
  ),

  createCourseBundle,
);

// Update course bundle

router.patch(
  "/:id",

  authMiddleware,

  authorizeRoles(
    "superAdmin",

    "admin",
  ),

  updateCourseBundle,
);

// Delete course bundle

router.delete(
  "/:id",

  authMiddleware,

  authorizeRoles(
    "superAdmin",

    "admin",
  ),

  removeCourseBundle,
);

module.exports = router;
