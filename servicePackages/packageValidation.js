const Joi = require("joi");

const createPackageValidation = Joi.object({
  name: Joi.string()
    .trim()
    .required(),

  description: Joi.string()
    .trim()
    .required(),

  image: Joi.string()
    .allow(null, "")
    .optional(),

  // ✅ Changed: services is now optional, removed min(1) and required()
  services: Joi.array()
    .items(Joi.string())
    .optional(),

  // ✅ Added: features field (was missing)
  features: Joi.array()
    .items(Joi.string())
    .optional(),

  price: Joi.number()
    .min(0)
    .required(),

  currency: Joi.string()
    .uppercase()
    .default("NGN"),

  isActive: Joi.boolean()
    .default(true),
});

const updatePackageValidation = Joi.object({
  name: Joi.string()
    .trim()
    .optional(),

  description: Joi.string()
    .trim()
    .optional(),

  image: Joi.string()
    .allow(null, "")
    .optional(),

  // ✅ Changed: services is optional, removed min(1)
  services: Joi.array()
    .items(Joi.string())
    .optional(),

  // ✅ Added: features field (was missing)
  features: Joi.array()
    .items(Joi.string())
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
  createPackageValidation,
  updatePackageValidation,
};