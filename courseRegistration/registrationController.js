// Handles Express request and response
const asyncHandler = require("../utils/asyncHandler");

// Standard API response format
const ApiResponse = require("../utils/ApiResponse");

// Import registration service functions
const {
  createRegistration,

  getStudentRegistrations,

  getRegistrationById,

  updateRegistration,

  deleteRegistration,
} = require("./registrationService");

// Student registers for a course
const create = asyncHandler(async (req, res) => {
  // Get logged-in user's ID from JWT
  const registration = await createRegistration(
    req.user.id,

    req.body.course,
  );

  res.status(201).json(
    new ApiResponse(
      201,

      "Course registration successful",

      registration,
    ),
  );
});

// Get all courses a student registered for
const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await getStudentRegistrations(req.user.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Registrations fetched successfully",

      registrations,
    ),
  );
});

// Get single registration
const getSingleRegistration = asyncHandler(async (req, res) => {
  const registration = await getRegistrationById(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Registration fetched successfully",

      registration,
    ),
  );
});

// Update registration
const update = asyncHandler(async (req, res) => {
  const registration = await updateRegistration(
    req.params.id,

    req.body,
  );

  res.status(200).json(
    new ApiResponse(
      200,

      "Registration updated successfully",

      registration,
    ),
  );
});

// Delete registration
const remove = asyncHandler(async (req, res) => {
  await deleteRegistration(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Registration deleted successfully",
    ),
  );
});

module.exports = {
  create,

  getMyRegistrations,

  getSingleRegistration,

  update,

  remove,
};
