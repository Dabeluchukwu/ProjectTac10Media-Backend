const Joi = require("joi");

// Validate media upload metadata
const createMediaValidation = Joi.object({
  mediaType: Joi.string()

    .valid(
      "image",

      "video",

      "document",
    )

    .required(),

  category: Joi.string()

    .valid(
      "profile",

      "course",

      "portfolio",

      "advertisement",

      "other",
    )

    .optional(),
});

module.exports = {
  createMediaValidation,
};
