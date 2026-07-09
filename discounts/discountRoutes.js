// Express router
const express = require("express");

// Controller methods
const {
  create,

  apply,

  getAll,

  getSingle,

  update,

  remove,
} = require("./discountController");

// Authentication middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Role middleware
const authorizeRoles = require("../middlewares/roleMiddleware");

// Create router
const router = express.Router();

// Create discount
// Admin only
router.post(
  "/",

  authMiddleware,

  authorizeRoles("admin"),

  create,
);

// Apply discount code
// User can use this
router.post(
  "/apply",

  authMiddleware,

  apply,
);

// Get all discounts
// Admin only
router.get(
  "/",

  authMiddleware,

  authorizeRoles("admin"),

  getAll,
);

// Get single discount
router.get(
  "/:id",

  authMiddleware,

  getSingle,
);

// Update discount
router.patch(
  "/:id",

  authMiddleware,

  authorizeRoles("admin"),

  update,
);

// Delete discount
router.delete(
  "/:id",

  authMiddleware,

  authorizeRoles("admin"),

  remove,
);

module.exports = router;
