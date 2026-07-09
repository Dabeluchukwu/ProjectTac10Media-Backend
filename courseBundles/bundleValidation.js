const Joi = require("joi");

// Create bundle validation

const createBundleValidation = Joi.object({
  name: Joi.string()

    .trim()

    .required()

    .messages({
      "string.empty": "Bundle name is required",
    }),

  slug: Joi.string()

    .trim()

    .lowercase()

    .required()

    .messages({
      "string.empty": "Bundle slug is required",
    }),

  description: Joi.string()

    .trim()

    .required()

    .messages({
      "string.empty": "Bundle description is required",
    }),

  image: Joi.string()

    .allow(null, "")

    .optional(),

  courses: Joi.array()

    .items(Joi.string())

    .min(1)

    .required()

    .messages({
      "array.min": "Bundle must contain at least one course",

      "any.required": "Courses are required",
    }),

  price: Joi.number()

    .min(0)

    .required()

    .messages({
      "number.base": "Price must be a number",

      "number.min": "Price cannot be negative",
    }),

  currency: Joi.string()

    .uppercase()

    .default("USD"),

  isActive: Joi.boolean()

    .default(true),
});

// Update bundle validation

const updateBundleValidation = Joi.object({
  name: Joi.string()

    .trim()

    .optional(),

  slug: Joi.string()

    .trim()

    .lowercase()

    .optional(),

  description: Joi.string()

    .trim()

    .optional(),

  image: Joi.string()

    .allow(null, "")

    .optional(),

  courses: Joi.array()

    .items(Joi.string())

    .min(1)

    .optional(),

  price: Joi.number()

    .min(0)

    .optional(),

  currency: Joi.string()

    .uppercase()

    .optional(),

  isActive: Joi.boolean()

    .optional(),
});

module.exports = {
  createBundleValidation,

  updateBundleValidation,
};
