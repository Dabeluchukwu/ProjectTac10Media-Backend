const ApiError = require("../utils/ApiError");



// Middleware to restrict access based on user roles
const authorizeRoles = (...roles) => {


  return (req, res, next) => {



    // Check if user is authenticated
    if (!req.user) {


      return next(

        new ApiError(

          401,

          "Unauthorized"

        )

      );


    }





    // Check if user's role is allowed
    if (

      !roles.includes(req.user.role)

    ) {


      return next(

        new ApiError(

          403,

          "You do not have permission to access this resource"

        )

      );


    }





    // User has permission
    next();


  };


};





module.exports = authorizeRoles;