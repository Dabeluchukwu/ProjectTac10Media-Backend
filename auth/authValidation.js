const Joi = require("joi");

const registerValidation = Joi.object({
  firstName: Joi.string().required().min(2).messages({
    "string.empty": "First name is required",
  }),

  lastName: Joi.string().required().min(2).messages({
    "string.empty": "Last name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Enter a valid email",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),

  phone: Joi.string().optional().allow(""),

  // User chooses account type
  role: Joi.string().valid("student", "client").default("client").messages({
    "any.only": "Role must be either student or client",
  }),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});

module.exports = {
  registerValidation,

  loginValidation,
};
