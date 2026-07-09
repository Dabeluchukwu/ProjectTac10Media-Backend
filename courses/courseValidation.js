const Joi = require("joi");

// Validation rules when creating a course
const createCourseValidation = Joi.object({
  // Course name/title
  title: Joi.string()

    .required()

    .min(3),

  // Course description
  description: Joi.string()

    .required()

    .min(10),

  // Optional course image URL
  image: Joi.string()

    .optional(),

  // Course price
  price: Joi.number()

    .min(0)

    .optional(),

  // Course duration
  duration: Joi.string()

    .required(),

  // Difficulty level
  level: Joi.string()

    .valid(
      "beginner",

      "intermediate",

      "advanced",
    )

    .optional(),
});

// Validation rules when updating a course
const updateCourseValidation = Joi.object({
  // Allow updating title
  title: Joi.string()

    .min(3)

    .optional(),

  // Allow updating description
  description: Joi.string()

    .min(10)

    .optional(),

  // Allow updating image
  image: Joi.string()

    .optional(),

  // Allow updating price
  price: Joi.number()

    .min(0)

    .optional(),

  // Allow updating duration
  duration: Joi.string()

    .optional(),

  // Allow changing level
  level: Joi.string()

    .valid(
      "beginner",

      "intermediate",

      "advanced",
    )

    .optional(),

  // Publish/unpublish course
  isPublished: Joi.boolean()

    .optional(),
});

module.exports = {
  createCourseValidation,

  updateCourseValidation,
};
