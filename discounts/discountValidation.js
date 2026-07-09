const Joi = require("joi");

// Create discount validation
const createDiscountValidation = Joi.object({
  code: Joi.string()

    .required()

    .min(3),

  type: Joi.string()

    .valid(
      "percentage",

      "fixed",
    )

    .required(),

  value: Joi.number()

    .required()

    .positive(),

  usageLimit: Joi.number()

    .optional(),

  expiresAt: Joi.date()

    .required(),
});

// Update discount validation
const updateDiscountValidation = Joi.object({
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
  createDiscountValidation,

  updateDiscountValidation,
};
