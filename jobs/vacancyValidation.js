const Joi = require("joi");

// Validation rules when creating a vacancy
const createVacancyValidation = Joi.object({
  // Job title
  title: Joi.string()

    .required()

    .min(3),

  // Full job description
  description: Joi.string()

    .required()

    .min(10),

  // Type/category of job
  category: Joi.string()

    .required()

    .min(3),

  // Job location
  location: Joi.string()

    .required()

    .min(2),

  // Expected budget
  budget: Joi.number()

    .min(0)

    .optional(),

  // Deadline for applicants
  applicationDeadline: Joi.date()

    .optional(),
});

// Validation rules when updating a vacancy
const updateVacancyValidation = Joi.object({
  // Update title
  title: Joi.string()

    .min(3)

    .optional(),

  // Update description
  description: Joi.string()

    .min(10)

    .optional(),

  // Update category
  category: Joi.string()

    .optional(),

  // Update location
  location: Joi.string()

    .optional(),

  // Update budget
  budget: Joi.number()

    .min(0)

    .optional(),

  // Change job status
  status: Joi.string()

    .valid(
      "open",

      "closed",
    )

    .optional(),

  // Update deadline
  applicationDeadline: Joi.date()

    .optional(),
});

module.exports = {
  createVacancyValidation,

  updateVacancyValidation,
};
