const User = require("../users/userModel");

const { hashPassword, comparePassword } = require("../extras/passwordService");

const { generateToken } = require("../extras/jwtService");

const ApiError = require("../utils/ApiError");

const registerUser = async (userData) => {
  // Check if email already exists
  const existingUser = await User.findOne({
    email: userData.email.toLowerCase(),
  });

  if (existingUser) {
    throw new ApiError(
      400,

      "Email already exists",
    );
  }

  // Hash password before saving
  const hashedPassword = await hashPassword(userData.password);

  // create user or student account
const user = await User.create({

  ...userData,

  password: hashedPassword,

});

  // Generate login token
  const token = generateToken({
    id: user._id,

    role: user.role,
  });
  const userResponse = user.toObject();

  delete userResponse.password;
 return {
  user: userResponse,
  token,
};
};

const loginUser = async (email, password) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken({
    id: user._id,

    role: user.role,
  });

  const userResponse = user.toObject();

  delete userResponse.password;

  return {
    user: userResponse,
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
