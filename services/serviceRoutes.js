// const express = require("express");

// const router = express.Router();

// const {
//   createProductionService,
//   getAllServices,
//   getSingleService,
//   updateProductionService,
//   removeProductionService,
// } = require("./serviceController");

// const authMiddleware = require("../middlewares/authMiddleware");

// const authorizeRoles = require("../middlewares/roleMiddleware");

// // ==============================
// // Public Routes
// // ==============================

// // Get all production services

// router.get("/", getAllServices);

// // Get single service

// router.get("/:id", getSingleService);

// // ==============================
// // Admin Routes
// // ==============================

// // Create service

// router.post(
//   "/",

//   authMiddleware,

//   authorizeRoles("superAdmin", "admin"),

//   createProductionService,
// );

// // Update service

// router.patch(
//   "/:id",

//   authMiddleware,

//   authorizeRoles("superAdmin", "admin"),

//   updateProductionService,
// );

// // Delete service

// router.delete(
//   "/:id",

//   authMiddleware,

//   authorizeRoles("superAdmin", "admin"),

//   removeProductionService,
// );

// module.exports = router;


const express = require("express");
const router = express.Router();
const {
  createProductionService,
  getAllServices,
  getSingleService,
  updateProductionService,
  removeProductionService,
  getAdminAllServices, 
} = require("./serviceController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// ==============================
// Public Routes
// ==============================

// Get all production services
router.get("/", getAllServices);

// Get single service
router.get("/:id", getSingleService);

// ==============================
// Admin Routes
// ==============================

// ✅ Get all services (admin - includes inactive)
router.get(
  "/admin/all",
  authMiddleware,
  authorizeRoles("superAdmin", "admin"),
  getAdminAllServices
);

// Create service
router.post(
  "/",
  authMiddleware,
  authorizeRoles("superAdmin", "admin"),
  createProductionService,
);

// Update service
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("superAdmin", "admin"),
  updateProductionService,
);

// Delete service
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("superAdmin", "admin"),
  removeProductionService,
);

module.exports = router;