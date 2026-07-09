const ApiError = require("../utils/ApiError");


const validateMiddleware = (schema) => {

  return (req, res, next) => {

    const { error } = schema.validate(
      req.body,
      {
        abortEarly: true,
      }
    );


    if (error) {

      return next(
        new ApiError(
          400,
          error.details[0].message
        )
      );

    }


    next();

  };

};


module.exports = validateMiddleware;