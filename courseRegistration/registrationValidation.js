const Joi = require("joi");

// Validation when a student registers for a course
const createRegistrationValidation = Joi.object({
  // Course the student wants to enroll in
  course: Joi.string()

    .required()

    .messages({
      "string.empty": "Course ID is required",

      "any.required": "Course ID is required",
    }),
});

// Validation when updating registration status
const updateRegistrationValidation = Joi.object({
  // Admin can approve or cancel registration
  status: Joi.string()

    .valid(
      "pending",

      "approved",

      "cancelled",
    )

    .optional(),

  // Payment update
  paymentStatus: Joi.string()

    .valid(
      "unpaid",

      "paid",
    )

    .optional(),

  // Update paid amount
  amountPaid: Joi.number()

    .min(0)

    .optional(),
});

module.exports = {
  createRegistrationValidation,

  updateRegistrationValidation,
};
