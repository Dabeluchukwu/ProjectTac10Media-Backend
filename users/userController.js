const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const ApiError = require("../utils/ApiError");

const User = require("./userModel");

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin,
  createInstructor: createInstructorService,
  updateProfile: updateProfileService,
  changePassword: changePasswordService,
  updateProfilePhoto: updateProfilePhotoService,
  removeProfilePhoto: removeProfilePhotoService,  
} = require("./userService");

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  
  let filter = {};
  if (role && role !== "all" && role !== "") {
    filter.role = role;
  }
  
  const users = await getUsers(filter);
  
  res.status(200).json(
    new ApiResponse(200, "Users fetched successfully", users)
  );
});

// Get single user
const getSingleUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "User fetched successfully",

      user,
    ),
  );
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Users can only update themselves
  if (
    ["client", "student", "instructor"].includes(req.user.role) &&
    req.user.id !== id
  ) {
    throw new ApiError(
      403,

      "You can only update your own profile",
    );
  }

  const user = await updateUser(
    id,

    req.body,
  );

  res.status(200).json(
    new ApiResponse(
      200,

      "User updated successfully",

      user,
    ),
  );
});

// Delete user
const removeUser = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id) {
    throw new ApiError(
      400,

      "Cannot delete your own account",
    );
  }

  await deleteUser(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "User deleted successfully",

      null,
    ),
  );
});

// Create admin account
const createAdminAccount = asyncHandler(async (req, res) => {
  const admin = await createAdmin(req.body);

  res.status(201).json(
    new ApiResponse(
      201,

      "Admin created successfully",

      admin,
    ),
  );
});

const createInstructor = asyncHandler(async (req, res) => {
  const instructor = await createInstructorService(req.body);

  res.status(201).json(
    new ApiResponse(
      201,
      "Instructor created successfully",
      instructor
    )
  );
});

// Update user role
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    throw new ApiError(400, "Role is required");
  }

  // ✅ User is now imported at the top
  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, "User role updated successfully", user)
  );
});

// ==============================
// ✅ Profile Routes (Authenticated User)
// ==============================

// ==============================
// ✅ Helper function to get user ID
// ==============================

const getUserId = (req) => {
  // ✅ Debug: Log what's in req.user
  console.log("🔍 getUserId - req.user:", req.user);
  
  // Try different possible locations for the user ID
  const userId = req.user?.id || req.user?._id || req.user?.userId || req.user?.sub;
  
  console.log("🔍 getUserId - extracted userId:", userId);
  
  if (!userId) {
    console.error("❌ User ID not found in req.user:", req.user);
    throw new ApiError(400, "User ID not found in token");
  }
  
  return userId;
};
// Then use it in all profile functions:

// Get current user profile
const getMyProfile = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const user = await getUserById(userId);
  res.status(200).json(
    new ApiResponse(200, "Profile fetched successfully", user)
  );
});

// Update my profile
const updateMyProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  const userId = getUserId(req);
  
  const user = await updateProfileService(userId, {
    firstName,
    lastName,
    phone,
  });
  
  res.status(200).json(
    new ApiResponse(200, "Profile updated successfully", user)
  );
});

// Change password
const changeMyPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = getUserId(req);
  
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }
  
  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }
  
  const result = await changePasswordService(userId, { currentPassword, newPassword });
  res.status(200).json(
    new ApiResponse(200, "Password changed successfully", result)
  );
});

// Update profile photo
const updateMyProfilePhoto = asyncHandler(async (req, res) => {
  const { url, publicId, filename } = req.body;
  const userId = getUserId(req);
  
  if (!url || !publicId) {
    throw new ApiError(400, "URL and publicId are required");
  }
  
  const media = await updateProfilePhotoService(userId, { url, publicId, filename });
  res.status(200).json(
    new ApiResponse(200, "Profile photo updated successfully", media)
  );
});

// Remove profile photo
const removeMyProfilePhoto = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await removeProfilePhotoService(userId);
  res.status(200).json(
    new ApiResponse(200, "Profile photo removed successfully", result)
  );
});

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUserProfile,
  removeUser,
  createAdminAccount,
  createInstructor,
  updateUserRole,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  updateMyProfilePhoto,
  removeMyProfilePhoto,
};
