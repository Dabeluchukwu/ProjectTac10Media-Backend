// Express router
const express = require("express");

// Import controller methods
const {
  create,

  getMine,

  getSingle,

  remove,
} = require("./mediaController");

// Authentication middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Create router
const router = express.Router();

// Upload media
// Authentication required
router.post(
  "/",

  authMiddleware,

  create,
);

// Get current user's media
router.get(
  "/my-media",

  authMiddleware,

  getMine,
);

// Get single media
router.get(
  "/:id",

  authMiddleware,

  getSingle,
);

// Delete media
router.delete(
  "/:id",

  authMiddleware,

  remove,
);

module.exports = router;
