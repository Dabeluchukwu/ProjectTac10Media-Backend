const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
  registerUser,
  loginUser,
} = require("./authService");

const {
  registerValidation,
  loginValidation,
} = require("./authValidation");



const register = asyncHandler(async (req, res) => {

  const { error } = registerValidation.validate(
    req.body
  );


  if (error) {
    throw new Error(error.details[0].message);
  }


  const result = await registerUser(
    req.body
  );


  res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully",
      result
    )
  );

});




const login = asyncHandler(async (req, res) => {


  const { error } = loginValidation.validate(
    req.body
  );


  if (error) {
    throw new Error(error.details[0].message);
  }



  const result = await loginUser(

    req.body.email,

    req.body.password

  );



  res.status(200).json(

    new ApiResponse(

      200,

      "Login successful",

      result

    )

  );


});



module.exports = {
  register,
  login,
};