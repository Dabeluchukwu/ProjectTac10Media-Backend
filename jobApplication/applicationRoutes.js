// // Express router
// const express = require("express");

// // Import controller functions
// const {
//   create,

//   getMine,

//   getForVacancy,

//   getSingle,

//   update,

//   remove,
// } = require("./applicationController");

// // Authentication middleware
// const authMiddleware = require("../middlewares/authMiddleware");

// // Role authorization middleware
// const authorizeRoles = require("../middlewares/roleMiddleware");

// // Create router
// const router = express.Router();

// // Submit job application
// // Any logged-in user can apply
// router.post(
//   "/",

//   authMiddleware,

//   create,
// );

// // Get applications created by logged-in user
// router.get(
//   "/my-applications",

//   authMiddleware,

//   getMine,
// );

// // Get applicants for a vacancy
// // Employer/admin access
// router.get(
//   "/vacancy/:vacancyId",

//   authMiddleware,

//   authorizeRoles(
//     "admin",

//     "company",
//   ),

//   getForVacancy,
// );

// // Get single application
// router.get(
//   "/:id",

//   authMiddleware,

//   getSingle,
// );

// // Update application status
// router.patch(
//   "/:id",

//   authMiddleware,

//   authorizeRoles(
//     "admin",

//     "company",
//   ),

//   update,
// );

// // Delete application
// router.delete(
//   "/:id",

//   authMiddleware,

//   remove,
// );

// module.exports = router;


// Express router
const express = require("express");

// Import controller functions
const {
  create,
  getMine,
  getForVacancy,
  getSingle,
  update,
  remove,
  checkApplication,
  checkApplicationByEmail, 
} = require("./applicationController");

// Authentication middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Role authorization middleware
const authorizeRoles = require("../middlewares/roleMiddleware");

// Create router
const router = express.Router();

// ✅ Submit job application - PUBLIC (no auth required)
router.post("/", create);

// ✅ Check if logged-in user has already applied
router.get("/check", checkApplication);

// ✅ Check if email has already applied (for guests)
router.get("/check-by-email", checkApplicationByEmail);

// Get applications created by logged-in user
router.get("/my-applications", authMiddleware, getMine);

// Get applicants for a vacancy
router.get("/vacancy/:vacancyId", authMiddleware, authorizeRoles("admin", "company"), getForVacancy);

// Get single application
router.get("/:id", authMiddleware, getSingle);

// Update application status
router.patch("/:id", authMiddleware, authorizeRoles("admin", "company"), update);

// Delete application
router.delete("/:id", authMiddleware, remove);

module.exports = router;