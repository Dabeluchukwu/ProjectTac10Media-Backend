const Joi = require("joi");
const mongoose = require("mongoose");

// Issue certificate validation

const createCertificateValidation = Joi.object({
  student: Joi.string()

    .required()

    .messages({
      "string.empty": "Student ID is required",

      "any.required": "Student ID is required",
    }),

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

    student:Joi.string()
.custom((value,helpers)=>{

 if(!mongoose.Types.ObjectId.isValid(value))

 return helpers.error("any.invalid");

 return value;

})
});

// Revoke certificate validation

const revokeCertificateValidation = Joi.object({
  reason: Joi.string()

    .trim()

    .optional(),
});

module.exports = {
  createCertificateValidation,

  revokeCertificateValidation,
};
