// Handles async Express controllers
const asyncHandler = require("../utils/asyncHandler");

// Standard API response format
const ApiResponse = require("../utils/ApiResponse");

// Import review service methods
const {
  createReview,

  getReviews,

  getReviewById,

  updateReview,

  deleteReview,
} = require("./reviewService");

// Create a review
const create = asyncHandler(async (req, res) => {
  // req.user comes from authMiddleware
  const review = await createReview(
    req.user.id,

    req.body,
  );

  res.status(201).json(
    new ApiResponse(
      201,

      "Review created successfully",

      review,
    ),
  );
});

// Get reviews for an item
const getAll = asyncHandler(async (req, res) => {
  const reviews = await getReviews(req.params.targetId);

  res.status(200).json(
    new ApiResponse(
      200,

      "Reviews fetched successfully",

      reviews,
    ),
  );
});

// Get single review
const getSingle = asyncHandler(async (req, res) => {
  const review = await getReviewById(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Review fetched successfully",

      review,
    ),
  );
});

// Update review
const update = asyncHandler(async (req, res) => {
  const review = await updateReview(
    req.params.id,

    req.body,
  );

  res.status(200).json(
    new ApiResponse(
      200,

      "Review updated successfully",

      review,
    ),
  );
});

// Delete review
const remove = asyncHandler(async (req, res) => {
  await deleteReview(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Review deleted successfully",
    ),
  );
});

module.exports = {
  create,

  getAll,

  getSingle,

  update,

  remove,
};
