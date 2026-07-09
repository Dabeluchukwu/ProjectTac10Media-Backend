const Joi = require("joi");


// Validate payment initialization

const initializePaymentValidation = Joi.object({

  email: Joi.string()

    .email()

    .required(),


  amount: Joi.number()

    .min(1)

    .required(),


  purpose: Joi.string()

    .valid(
      "course",
      "booking",
      "advertisement",
      "other"
    )

    .required(),


  referenceId: Joi.string()

    .required(),


  bookingId: Joi.string()

    .optional(),

    registrationId: Joi.string().optional(), 

});



module.exports = {

  initializePaymentValidation,

};