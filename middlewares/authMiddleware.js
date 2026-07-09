const { verifyToken } = require("../extras/jwtService");

const ApiError = require("../utils/ApiError");

// Middleware to authenticate logged-in users
const authMiddleware = (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        401,

        "Authorization token required",
      );
    }

    // Extract token from:
    // Bearer token_here
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);


    // ✅ Debug: Log the decoded token to see what's inside
    console.log("🔍 Decoded token:", decoded);

    // Ensure token contains user information
    if (!decoded || !decoded.id) {
      throw new ApiError(
        401,

        "Invalid token",
      );
    }

    // Attach user data to request
    // Available as req.user
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
