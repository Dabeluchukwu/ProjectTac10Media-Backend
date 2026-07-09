const Joi = require("joi");



const updateUserValidation = Joi.object({

  firstName: Joi.string()
    .min(2),

  lastName: Joi.string()
    .min(2),

  phone: Joi.string(),

  profileImage: Joi.string(),

});



module.exports = {

  updateUserValidation,

};