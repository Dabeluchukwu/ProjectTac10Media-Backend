// const express = require("express");

// const router = express.Router();

// const {
//   createServicePackage,

//   getAllPackages,

//   getSinglePackage,

//   updateServicePackage,

//   removeServicePackage,
// } = require("./packageController");

// const authMiddleware = require("../middlewares/authMiddleware");

// const authorizeRoles = require("../middlewares/roleMiddleware");

// // ==============================
// // Public Routes
// // ==============================

// // Get all packages

// router.get(
//   "/",

//   getAllPackages,
// );

// // Get single package

// router.get(
//   "/:id",

//   getSinglePackage,
// );

// // ==============================
// // Admin Routes
// // ==============================

// // Create package

// router.post(
//   "/",

//   authMiddleware,

//   authorizeRoles(
//     "superAdmin",

//     "admin",
//   ),

//   createServicePackage,
// );

// // Update package

// router.patch(
//   "/:id",

//   authMiddleware,

//   authorizeRoles(
//     "superAdmin",

//     "admin",
//   ),

//   updateServicePackage,
// );

// // Delete package

// router.delete(
//   "/:id",

//   authMiddleware,

//   authorizeRoles(
//     "superAdmin",

//     "admin",
//   ),

//   removeServicePackage,
// );

// module.exports = router;


const express = require("express");
const router = express.Router();
const {
  createServicePackage,
  getAllPackages,
  getSinglePackage,
  updateServicePackage,
  removeServicePackage,
  getAdminAllPackages, 
} = require("./packageController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// ==============================
// Public Routes
// ==============================

// Get all packages
router.get("/", getAllPackages);

// Get single package
router.get("/:id", getSinglePackage);

// ==============================
// Admin Routes
// ==============================

// ✅ Get all packages (admin - includes inactive)
router.get(
  "/admin/all",
  authMiddleware,
  authorizeRoles("superAdmin", "admin"),
  getAdminAllPackages
);

// Create package
router.post(
  "/",
  authMiddleware,
  authorizeRoles("superAdmin", "admin"),
  createServicePackage,
);

// Update package
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("superAdmin", "admin"),
  updateServicePackage,
);

// Delete package
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("superAdmin", "admin"),
  removeServicePackage,
);

module.exports = router;
