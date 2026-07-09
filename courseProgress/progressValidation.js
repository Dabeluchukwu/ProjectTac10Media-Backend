const Joi = require("joi");

// Start course progress validation

const createProgressValidation = Joi.object({
  course: Joi.string()

    .required()

    .messages({
      "string.empty": "Course ID is required",

      "any.required": "Course ID is required",
    }),

  registration: Joi.string()

    .required()

    .messages({
      "string.empty": "Registration ID is required",

      "any.required": "Registration ID is required",
    }),
});

// Complete lesson validation

const completeLessonValidation = Joi.object({
  lessonId: Joi.string()

    .required()

    .messages({
      "string.empty": "Lesson ID is required",

      "any.required": "Lesson ID is required",
    }),
});

module.exports = {
  createProgressValidation,

  completeLessonValidation,
};
