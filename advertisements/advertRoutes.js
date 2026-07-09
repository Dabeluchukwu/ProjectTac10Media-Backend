const express = require("express");

// Controller methods
const {
  create,
  getAll,
  getSingle,
  update,
  remove,
} = require("./advertController");

// Authentication middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Role middleware
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * Create advertisement
 * Only admin/company can create adverts
 */
router.post("/", authMiddleware, authorizeRoles("admin", "company"), create);

/**
 * Get all active adverts
 * Public route
 */
router.get("/", getAll);

/**
 * Get single advert
 * Public route
 */
router.get("/:id", getSingle);

/**
 * Update advert
 */
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "company"),
  update,
);

/**
 * Delete advert
 */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "company"),
  remove,
);

module.exports = router;
