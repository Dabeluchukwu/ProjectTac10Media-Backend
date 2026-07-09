const Joi = require("joi");

// Create review validation
const createReviewValidation = Joi.object({
  targetType: Joi.string()

    .valid(
      "course",

      "service",

      "user",
    )

    .required(),

  targetId: Joi.string()

    .required(),

  rating: Joi.number()

    .min(1)

    .max(5)

    .required(),

  comment: Joi.string()

    .min(5)

    .required(),
});

// Update review validation
const updateReviewValidation = Joi.object({
  rating: Joi.number()

    .min(1)

    .max(5)

    .optional(),

  comment: Joi.string()

    .min(5)

    .optional(),
});

module.exports = {
  createReviewValidation,

  updateReviewValidation,
};
