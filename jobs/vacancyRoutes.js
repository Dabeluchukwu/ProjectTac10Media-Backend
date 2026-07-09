// Express router
const express = require("express");

// Import controller functions
const {
  create,

  getAll,

  getSingle,

  update,

  remove,
} = require("./vacancyController");

// Authentication middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Role middleware
const authorizeRoles = require("../middlewares/roleMiddleware");

// Create router
const router = express.Router();

// Create vacancy
// Only admins/companies/instructors can post jobs
router.post(
  "/",

  authMiddleware,

  authorizeRoles(
    "admin",

    "company",
  ),

  create,
);

// Get all vacancies
// Public route
router.get(
  "/",

  getAll,
);

// Get single vacancy
router.get(
  "/:id",

  getSingle,
);

// Update vacancy
router.patch(
  "/:id",

  authMiddleware,

  authorizeRoles(
    "admin",

    "company",
  ),

  update,
);

// Delete vacancy
router.delete(
  "/:id",

  authMiddleware,

  authorizeRoles(
    "admin",

    "company",
  ),

  remove,
);

module.exports = router;
