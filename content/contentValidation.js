const Joi = require("joi");

// Validate creating new content page
const createContentValidation = Joi.object({
  page: Joi.string()

    .trim()

    .required(),

  sections: Joi.object()

    .default({}),

  meta: Joi.object({
    title: Joi.string()

      .allow("")

      .optional(),

    description: Joi.string()

      .allow("")

      .optional(),

    keywords: Joi.array()

      .items(Joi.string())

      .optional(),
  })

    .optional(),

  isPublished: Joi.boolean()

    .optional(),
});

// Validate updating content
const updateContentValidation = Joi.object({
  sections: Joi.object()

    .optional(),

  meta: Joi.object({
    title: Joi.string()

      .allow("")

      .optional(),

    description: Joi.string()

      .allow("")

      .optional(),

    keywords: Joi.array()

      .items(Joi.string())

      .optional(),
  })

    .optional(),

  isPublished: Joi.boolean()

    .optional(),
});

module.exports = {
  createContentValidation,

  updateContentValidation,
};
