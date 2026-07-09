// Express router
const express = require("express");

// Import controller methods
const {
  create,

  getAll,

  getSingle,

  update,

  remove,
} = require("./reviewController");

// Authentication middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Create router
const router = express.Router();

// Create review
// Logged-in users only
router.post(
  "/",

  authMiddleware,

  create,
);

// Get reviews for target item
// Example:
// /api/v1/reviews/courseId
router.get(
  "/:targetId",

  getAll,
);

// Get single review
router.get(
  "/single/:id",

  getSingle,
);

// Update own review
router.patch(
  "/:id",

  authMiddleware,

  update,
);

// Delete review
router.delete(
  "/:id",

  authMiddleware,

  remove,
);

module.exports = router;
