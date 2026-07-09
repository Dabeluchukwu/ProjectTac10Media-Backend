const Booking = require("./bookingModel");
const Service = require("../services/serviceModel");
const ServicePackage = require("../servicePackages/packageModel");
const ApiError = require("../utils/ApiError");

// ==========================
// CREATE BOOKING
// ==========================
const createBooking = async (userId, bookingData) => {
  const {
    bookingType,
    service,
    package: pkg,
    bookingDate,
    location,
    description,
    amount: providedAmount,
  } = bookingData;

  let amount = 0;
  let currency = "NGN";

  // -------------------------
  // SERVICE BOOKING
  // -------------------------
  if (bookingType === "service") {
    if (!service) {
      throw new ApiError(400, "Service is required for service booking");
    }

    if (pkg) {
      throw new ApiError(
        400,
        "Package should not be included in service booking",
      );
    }

    const serviceData = await Service.findById(service);

    if (!serviceData) {
      throw new ApiError(404, "Service not found");
    }

    amount = serviceData.price;
    currency = serviceData.currency || "NGN";
  }

  // -------------------------
  // PACKAGE BOOKING
  // -------------------------
  if (bookingType === "package") {
    if (!pkg) {
      throw new ApiError(400, "Package is required for package booking");
    }

    if (service) {
      throw new ApiError(
        400,
        "Service should not be included in package booking",
      );
    }

    const packageData = await ServicePackage.findById(pkg);

    if (!packageData) {
      throw new ApiError(404, "Service package not found");
    }

    amount = packageData.price;
    currency = packageData.currency || "NGN";
  }

  // Use provided amount if available, otherwise use calculated amount
  const finalAmount = providedAmount || amount;

  // -------------------------
  // CREATE BOOKING
  // -------------------------
  const booking = await Booking.create({
    user: userId,
    bookingType,
    service: service || null,
    package: pkg || null,
    bookingDate,
    location,
    description: description || "",
    amount: finalAmount,
    currency,
  });

  return booking;
};

// ==========================
// GET USER BOOKINGS
// ==========================
const getUserBookings = async (userId) => {
  return await Booking.find({ user: userId })
    .populate("service", "name price currency")
    .populate("package", "name price currency")
    .sort({ createdAt: -1 });
};

// ==========================
// GET SINGLE BOOKING
// ==========================
const getBookingById = async (bookingId, userId) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  })
    .populate("user", "firstName lastName email")
    .populate("service")
    .populate("package");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return booking;
};

// ==========================
// UPDATE BOOKING
// ==========================
const updateBooking = async (bookingId, userId, updateData) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  Object.assign(booking, updateData);

  await booking.save();

  return booking;
};

// ==========================
// DELETE BOOKING
// ==========================
const deleteBooking = async (bookingId, userId) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  await booking.deleteOne();

  return booking;
};

// ==========================
// ADMIN FUNCTIONS
// ==========================

// ✅ Get all bookings for admin (with status filter)
const getAdminAllBookingsService = async (statusFilter = null) => {
  const filter = {};
  if (statusFilter && statusFilter !== "all") {
    filter.status = statusFilter;
  }

  return await Booking.find(filter)
    .populate("user", "firstName lastName email phone")
    .populate("service", "name price")
    .populate("package", "name price")
    .sort({ createdAt: -1 });
};

// ✅ Update booking status (admin)
const updateAdminBookingStatusService = async (bookingId, status) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status },
    { new: true }
  )
    .populate("user", "firstName lastName email")
    .populate("service", "name price")
    .populate("package", "name price");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return booking;
};


// ✅ Update booking progress (admin)
const updateBookingProgressService = async (bookingId, progress) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { progress },
    { new: true }
  )
    .populate("user", "firstName lastName email")
    .populate("service", "name price")
    .populate("package", "name price");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return booking;
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getAdminAllBookingsService, 
  updateAdminBookingStatusService, 
  updateBookingProgressService,
};