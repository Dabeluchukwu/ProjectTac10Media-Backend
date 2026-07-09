// Import review model
const Review = require("./reviewModel");

// Import custom error handler
const ApiError = require("../utils/ApiError");

// Create a new review
const createReview = async (
  userId,

  reviewData,
) => {
  // Check if user already reviewed this item
  const existingReview = await Review.findOne({
    user: userId,

    targetId: reviewData.targetId,
  });

  if (existingReview) {
    throw new ApiError(
      400,

      "You have already reviewed this item",
    );
  }

  // Create review
  const review = await Review.create({
    user: userId,

    ...reviewData,
  });

  return review;
};

// Get reviews for a specific item
const getReviews = async (targetId) => {
  const reviews = await Review.find({
    targetId,
  })

    .populate(
      "user",

      "firstName lastName",
    );

  return reviews;
};

// Get single review
const getReviewById = async (reviewId) => {
  const review = await Review.findById(reviewId)

    .populate(
      "user",

      "firstName lastName",
    );

  if (!review) {
    throw new ApiError(
      404,

      "Review not found",
    );
  }

  return review;
};

// Update review
const updateReview = async (
  reviewId,

  updateData,
) => {
  const review = await Review.findByIdAndUpdate(
    reviewId,

    updateData,

    {
      new: true,

      runValidators: true,
    },
  );

  if (!review) {
    throw new ApiError(
      404,

      "Review not found",
    );
  }

  return review;
};

// Delete review
const deleteReview = async (reviewId) => {
  const review = await Review.findByIdAndDelete(reviewId);

  if (!review) {
    throw new ApiError(
      404,

      "Review not found",
    );
  }

  return review;
};

module.exports = {
  createReview,

  getReviews,

  getReviewById,

  updateReview,

  deleteReview,
};
