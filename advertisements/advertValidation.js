const Joi = require("joi");

// Create advert validation
const createAdvertValidation = Joi.object({
  title: Joi.string()

    .required()

    .min(3),

  description: Joi.string()

    .required()

    .min(10),

  image: Joi.string()

    .required(),

  link: Joi.string()

    .optional(),

  type: Joi.string()

    .valid(
      "course",

      "service",

      "general",
    )

    .optional(),

  expiresAt: Joi.date()

    .optional(),
});

// Update advert validation
const updateAdvertValidation = Joi.object({
  title: Joi.string()

    .optional(),

  description: Joi.string()

    .optional(),

  status: Joi.string()

    .valid(
      "active",

      "inactive",
    )

    .optional(),

  expiresAt: Joi.date()

    .optional(),
});

module.exports = {
  createAdvertValidation,

  updateAdvertValidation,
};
