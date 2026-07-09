const express = require("express");
const router = express.Router();

// Controllers
const {
  getAllUsers,
  getSingleUser,
  updateUserProfile,
  removeUser,
  createAdminAccount,
  createInstructor,
  updateUserRole,
  // ✅ Profile routes
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  updateMyProfilePhoto,
  removeMyProfilePhoto,
} = require("./userController");

// Middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// ==============================
// ✅ SPECIFIC ROUTES FIRST (BEFORE /:id)
// ==============================

// Create admin account
// Accessible by: SuperAdmin only
router.post(
  "/admin",
  authMiddleware,
  authorizeRoles("superAdmin"),
  createAdminAccount
);

// Create instructor account
// Accessible by: Admin, SuperAdmin
router.post(
  "/instructor",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  createInstructor
);

// ==============================
// ✅ PROFILE ROUTES (Specific paths - MUST BE BEFORE /:id)
// ==============================

// Get current user profile
router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

// Update profile
router.put(
  "/me",
  authMiddleware,
  updateMyProfile
);

// Change password
router.patch(
  "/me/password",
  authMiddleware,
  changeMyPassword
);

// Update profile photo
router.post(
  "/me/photo",
  authMiddleware,
  updateMyProfilePhoto
);

// Remove profile photo
router.delete(
  "/me/photo",
  authMiddleware,
  removeMyProfilePhoto
);

// ==============================
// ✅ GENERIC ROUTES LAST (AFTER SPECIFIC ROUTES)
// ==============================

// Get all users
// Accessible by: Admin, SuperAdmin
router.get(
  "/",
  authMiddleware,
  authorizeRoles("superAdmin", "admin"),
  getAllUsers
);

// Get single user
// Accessible by: Admin, SuperAdmin, or the user themselves (handled in controller)
router.get(
  "/:id",
  authMiddleware,
  getSingleUser
);

// Update user role
router.patch(
  "/:id/role",
  authMiddleware,
  authorizeRoles("admin", "superAdmin"),
  updateUserRole
);

// Update user profile
// Accessible by: Admin, SuperAdmin, or the user themselves (handled in controller)
router.patch(
  "/:id",
  authMiddleware,
  updateUserProfile
);

// Delete user
// Accessible by: Admin, SuperAdmin only
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("superAdmin", "admin"),
  removeUser
);

module.exports = router;