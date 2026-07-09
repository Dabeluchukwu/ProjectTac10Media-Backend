const User = require("./userModel");

const ApiError = require("../utils/ApiError");

const { hashPassword } = require("../extras/passwordService");
const Media = require("../media/mediaModel");

const mongoose = require("mongoose");

// Get all users with optional filter
const getUsers = async (filter = {}) => {
  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 });
  return users;
};

// Get single user by ID
const getUserById = async (id) => {
  console.log("🔍 getUserById called with id:", id);
  console.log("🔍 id type:", typeof id);
  console.log("🔍 id is valid ObjectId:", mongoose.Types.ObjectId.isValid(id));
  
  // Check if ID format is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("❌ Invalid ObjectId format:", id);
    throw new ApiError(400, "Invalid user ID format");
  }

  const user = await User.findById(id).select("-password");

  if (!user) {
    console.log("❌ User not found for id:", id);
    throw new ApiError(404, "User not found");
  }

  console.log("✅ User found:", user.email);
  return user;
};
// Update user profile
const updateUser = async (
  id,

  updateData,
) => {
  // Check if update data exists
  if (!updateData || Object.keys(updateData).length === 0) {
    throw new ApiError(
      400,

      "No update data provided",
    );
  }

  // Prevent users from changing protected fields
  const blockedFields = ["role", "password", "_id", "createdAt", "updatedAt"];

  blockedFields.forEach((field) => {
    delete updateData[field];
  });

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(
      400,

      "Invalid user ID format",
    );
  }

  const user = await User.findByIdAndUpdate(
    id,

    updateData,

    {
      new: true,

      runValidators: true,
    },
  )

    .select("-password");

  if (!user) {
    throw new ApiError(
      404,

      "User not found",
    );
  }

  return user;
};

// Delete user
const deleteUser = async (id) => {
  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(
      400,

      "Invalid user ID format",
    );
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new ApiError(
      404,

      "User not found",
    );
  }

  return user;
};

// Super Admin creates Admin account
const createAdmin = async (adminData) => {
  // Check if email already exists
  const existingUser = await User.findOne({
    email: adminData.email.toLowerCase(),
  });

  if (existingUser) {
    throw new ApiError(
      400,

      "Email already exists",
    );
  }

  // Hash admin password
  const hashedPassword = await hashPassword(adminData.password);

  // Create admin user
  const admin = await User.create({
    firstName: adminData.firstName,

    lastName: adminData.lastName,

    email: adminData.email.toLowerCase(),

    password: hashedPassword,

    phone: adminData.phone || null,

    // Force admin role
    role: "admin",
  });

  // Remove password before returning
  admin.password = undefined;

  return admin;
};

// Create instructor account (Admin only)
const createInstructor = async (instructorData) => {
  // Check if email already exists
  const existingUser = await User.findOne({
    email: instructorData.email.toLowerCase(),
  });

  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(instructorData.password);

  // Create instructor user
  const instructor = await User.create({
    firstName: instructorData.firstName,
    lastName: instructorData.lastName,
    email: instructorData.email.toLowerCase(),
    password: hashedPassword,
    phone: instructorData.phone || null,
    role: "instructor",
  });

  // Remove password before returning
  instructor.password = undefined;

  return instructor;
};

// ==============================
// ✅ Profile Service Functions
// ==============================

// Update profile (firstName, lastName, phone)
const updateProfile = async (userId, profileData) => {
  const { firstName, lastName, phone } = profileData;
  
  const user = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, phone },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

// Change password
const changePassword = async (userId, passwordData) => {
  const { currentPassword, newPassword } = passwordData;

  // Get user with password
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Verify current password
  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();

  return { message: "Password changed successfully" };
};

// Update profile photo
const updateProfilePhoto = async (userId, fileData) => {
  const { url, publicId } = fileData;

  // Find existing profile photo and delete it
  const Media = require("../media/mediaModel");
  const existingMedia = await Media.findOne({
    uploadedBy: userId,
    category: "profile",
  });

  if (existingMedia) {
    // Delete from Cloudinary
    const cloudinary = require("../config/cloudinary");
    await cloudinary.uploader.destroy(existingMedia.publicId);
    await existingMedia.deleteOne();
  }

  // Create new media record
  const media = await Media.create({
    uploadedBy: userId,
    url,
    publicId,
    mediaType: "image",
    category: "profile",
    filename: fileData.filename || "profile-photo",
  });

  // Update user with profile image
  await User.findByIdAndUpdate(userId, { profileImage: url });

  return media;
};

// Remove profile photo
const removeProfilePhoto = async (userId) => {
  const Media = require("../media/mediaModel");
  const media = await Media.findOne({
    uploadedBy: userId,
    category: "profile",
  });

  if (!media) {
    throw new ApiError(404, "Profile photo not found");
  }

  // Delete from Cloudinary
  const cloudinary = require("../config/cloudinary");
  await cloudinary.uploader.destroy(media.publicId);

  // Delete media record
  await media.deleteOne();

  // Remove profile image from user
  await User.findByIdAndUpdate(userId, { profileImage: null });

  return { message: "Profile photo removed successfully" };
};


module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin,
  createInstructor,
  updateProfile,
  changePassword,
  updateProfilePhoto,
  removeProfilePhoto,
};
