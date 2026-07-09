const express = require("express");

const router = express.Router();

// Controllers
const {
  getPageContent,

  createPageContent,

  updatePageContent,

  removePageContent,
} = require("./contentController");

// Middlewares
const authMiddleware = require("../middlewares/authMiddleware");

const authorizeRoles = require("../middlewares/roleMiddleware");

// ==============================
// Public Content Route
// ==============================

// Get page content
// Example:
// /api/v1/content/home
router.get(
  "/:page",

  getPageContent,
);

// ==============================
// Admin Content Routes
// ==============================

// Create new page content
// Example:
// Create home/about/courses content
router.post(
  "/",

  authMiddleware,

  authorizeRoles(
    "superAdmin",

    "admin",
  ),

  createPageContent,
);

// Update page content
// Example:
// PATCH /content/home
router.patch(
  "/:page",

  authMiddleware,

  authorizeRoles(
    "superAdmin",

    "admin",
  ),

  updatePageContent,
);

// Delete page content
router.delete(
  "/:page",

  authMiddleware,

  authorizeRoles(
    "superAdmin",

    "admin",
  ),

  removePageContent,
);

module.exports = router;
