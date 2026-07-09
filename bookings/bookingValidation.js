const Joi = require("joi");

// Validation rules for creating a booking
const createBookingValidation = Joi.object({
  // Booking can be a single service or package
  bookingType: Joi.string()
    .valid("service", "package")
    .required(),

  // Single production service ID
  service: Joi.string()
    .optional()
    .allow(null),

  // Service package ID
  package: Joi.string()
    .optional()
    .allow(null),

  // Date the client wants the service
  bookingDate: Joi.date()
    .required(),

  // Location of service
  location: Joi.string()
    .required()
    .min(3),

  // Extra information
  description: Joi.string()
    .optional(),

  // ✅ Amount - Allow from frontend
  amount: Joi.number()
    .min(0)
    .optional(),
})

.custom((value, helpers) => {
  if (value.bookingType === "service" && value.package) {
    return helpers.message(
      "Package should not be provided for service booking"
    );
  }

  if (value.bookingType === "package" && value.service) {
    return helpers.message(
      "Service should not be provided for package booking"
    );
  }

  return value;
});

// Validation rules when updating booking
const updateBookingValidation = Joi.object({
  bookingDate: Joi.date()
    .optional(),

  location: Joi.string()
    .min(3)
    .optional(),

  description: Joi.string()
    .optional(),

  status: Joi.string()
    .valid("pending", "confirmed", "completed", "cancelled")
    .optional(),
});

module.exports = {
  createBookingValidation,
  updateBookingValidation,
};