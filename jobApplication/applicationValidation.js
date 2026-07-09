const Joi = require("joi");

// Validation when a user applies for a job
const createApplicationValidation = Joi.object({
  // Vacancy the user is applying for
  vacancy: Joi.string()

    .required()

    .messages({
      "string.empty": "Vacancy ID is required",

      "any.required": "Vacancy ID is required",
    }),

  // Applicant message / cover letter
  message: Joi.string()

    .required()

    .min(10)

    .messages({
      "string.min": "Message must be at least 10 characters",
    }),

  // Optional CV or portfolio link
  attachment: Joi.string()

    .optional(),
});

// Validation when updating application status
const updateApplicationValidation = Joi.object({
  // Employer/admin changes application status
  status: Joi.string()

    .valid(
      "pending",

      "accepted",

      "rejected",
    )

    .optional(),
});

module.exports = {
  createApplicationValidation,

  updateApplicationValidation,
};
