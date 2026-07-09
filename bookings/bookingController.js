// Handles Express request/response logic
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Import booking business logic
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getAdminAllBookingsService,
  updateAdminBookingStatusService,
  updateBookingProgressService,
} = require("./bookingService");

// Import validations
const {
  createBookingValidation,
  updateBookingValidation,
} = require("./bookingValidation");

// Create a new booking
const create = asyncHandler(async (req, res) => {
  const { error } = createBookingValidation.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const booking = await createBooking(
    req.user.id,
    req.body,
  );

  res.status(201).json(
    new ApiResponse(
      201,
      "Booking created successfully",
      booking,
    ),
  );
});

// Get all bookings belonging to logged-in user
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await getUserBookings(req.user.id);

  res.status(200).json(
    new ApiResponse(
      200,
      "Bookings fetched successfully",
      bookings,
    ),
  );
});

// Get single booking
const getSingleBooking = asyncHandler(async (req, res) => {
  const booking = await getBookingById(
    req.params.id,
    req.user.id,
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Booking fetched successfully",
      booking,
    ),
  );
});

// Update booking
const update = asyncHandler(async (req, res) => {
  const { error } = updateBookingValidation.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  // Verify ownership booking
  const booking = await updateBooking(
    req.params.id,
    req.user.id,
    req.body,
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Booking updated successfully",
      booking,
    ),
  );
});

// Delete booking
const remove = asyncHandler(async (req, res) => {
  await deleteBooking(
    req.params.id,
    req.user.id,
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Booking deleted successfully",
    ),
  );
});

// ✅ Get all bookings for admin (with status filter)
const getAdminAllBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const bookings = await getAdminAllBookingsService(status);
  res.status(200).json(
    new ApiResponse(
      200,
      "All bookings fetched successfully",
      bookings,
    ),
  );
});

// ✅ Update booking status (admin)
const updateAdminBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const booking = await updateAdminBookingStatusService(id, status);
  res.status(200).json(
    new ApiResponse(
      200,
      "Booking status updated successfully",
      booking,
    ),
  );
});

// ✅ Update booking progress (admin)
const updateProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  if (!progress) {
    throw new ApiError(400, "Progress status is required");
  }

  const booking = await updateBookingProgressService(id, progress);
  res.status(200).json(
    new ApiResponse(
      200,
      "Booking progress updated successfully",
      booking,
    ),
  );
});

module.exports = {
  create,
  getMyBookings,
  getSingleBooking,
  update,
  remove,
  getAdminAllBookings, 
  updateAdminBookingStatus, 
  updateProgress,
};