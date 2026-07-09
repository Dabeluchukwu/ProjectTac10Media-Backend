const Joi = require("joi");

// Create service validation

const createServiceValidation = Joi.object({
  name: Joi.string()

    .trim()

    .required()

    .messages({
      "string.empty": "Service name is required",
    }),

  description: Joi.string()

    .trim()

    .required()

    .messages({
      "string.empty": "Service description is required",
    }),

  image: Joi.string()

    .allow(null, "")

    .optional(),

  category: Joi.string()

    .trim()

    .default("production"),

  price: Joi.number()

    .min(0)

    .required()

    .messages({
      "number.base": "Price must be a number",

      "number.min": "Price cannot be negative",
    }),

  currency: Joi.string()

    .uppercase()

    .default("NGN"),

  duration: Joi.string()

    .allow(null, "")

    .optional(),

  isActive: Joi.boolean()

    .default(true),
});

// Update service validation

const updateServiceValidation = Joi.object({
  name: Joi.string()

    .trim()

    .optional(),

  description: Joi.string()

    .trim()

    .optional(),

  image: Joi.string()

    .allow(null, "")

    .optional(),

  category: Joi.string()

    .trim()

    .optional(),

  price: Joi.number()

    .min(0)

    .optional(),

  currency: Joi.string()

    .uppercase()

    .optional(),

  duration: Joi.string()

    .allow(null, "")

    .optional(),

  isActive: Joi.boolean()

    .optional(),
});

module.exports = {
  createServiceValidation,

  updateServiceValidation,
};
