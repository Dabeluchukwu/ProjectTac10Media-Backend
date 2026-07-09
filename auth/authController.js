const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const User = require("../users/userModel");
const { sendPasswordResetEmail } = require("../extras/emailService");
const { hashPassword } = require("../extras/passwordService");
const crypto = require("crypto");

const {
  registerUser,
  loginUser,
} = require("./authService");

const {
  registerValidation,
  loginValidation,
} = require("./authValidation");

const register = asyncHandler(async (req, res) => {
  const { error } = registerValidation.validate(req.body);

  if (error) {
    throw new Error(error.details[0].message);
  }

  const result = await registerUser(req.body);

  res.status(201).json(
    new ApiResponse(201, "User registered successfully", result)
  );
});

const login = asyncHandler(async (req, res) => {
  const { error } = loginValidation.validate(req.body);

  if (error) {
    throw new Error(error.details[0].message);
  }

  const result = await loginUser(
    req.body.email,
    req.body.password
  );

  res.status(200).json(
    new ApiResponse(200, "Login successful", result)
  );
});

// ✅ Forgot Password - Send reset email
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(404, "User with this email not found");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiry = resetTokenExpiry;
  await user.save();

  // Send email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  await sendPasswordResetEmail(user.email, user.firstName, resetUrl);

  res.status(200).json(
    new ApiResponse(200, "Password reset email sent successfully", {
      message: "If an account exists with this email, you will receive a password reset link.",
    })
  );
});

// ✅ Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  // Find user with valid token
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  // Hash new password
  const hashedPassword = await hashPassword(password);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, "Password reset successfully", {
      message: "Your password has been reset. You can now login with your new password.",
    })
  );
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};