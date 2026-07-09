// Express router
const express = require("express");

// Import controller methods
const {
  create,

  getMyRegistrations,

  getSingleRegistration,

  update,

  remove,
} = require("./registrationController");

// Authentication middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Role middleware for admin actions
const authorizeRoles = require("../middlewares/roleMiddleware");

// Create router
const router = express.Router();

// Register for course
// Only students can register
router.post(
  "/",

  authMiddleware,

  authorizeRoles("student"),

  create,
);
// Get logged-in user's registrations
router.get(
  "/",

  authMiddleware,

  getMyRegistrations,
);

// Get one registration
router.get(
  "/:id",

  authMiddleware,

  getSingleRegistration,
);

// Update registration status
// Usually admin/instructor handles this
router.patch(
  "/:id",

  authMiddleware,

  authorizeRoles(
    "admin",

    "instructor",
  ),

  update,
);

// Delete registration
router.delete(
  "/:id",

  authMiddleware,

  remove,
);

module.exports = router;
