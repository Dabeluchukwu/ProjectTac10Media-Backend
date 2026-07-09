// Handles Express request and response
const asyncHandler = require("../utils/asyncHandler");

// Standard response formatter
const ApiResponse = require("../utils/ApiResponse");

// Import vacancy business logic
const {
  createVacancy,

  getVacancies,

  getVacancyById,

  updateVacancy,

  deleteVacancy,
} = require("./vacancyService");

// Create a new vacancy
const create = asyncHandler(async (req, res) => {
  // req.user comes from authMiddleware
  // It identifies the person posting the vacancy
  const vacancy = await createVacancy(
    req.user.id,

    req.body,
  );

  res.status(201).json(
    new ApiResponse(
      201,

      "Vacancy created successfully",

      vacancy,
    ),
  );
});

// Get all vacancies
const getAll = asyncHandler(async (req, res) => {
  const vacancies = await getVacancies();

  res.status(200).json(
    new ApiResponse(
      200,

      "Vacancies fetched successfully",

      vacancies,
    ),
  );
});

// Get one vacancy
const getSingle = asyncHandler(async (req, res) => {
  const vacancy = await getVacancyById(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Vacancy fetched successfully",

      vacancy,
    ),
  );
});

// Update vacancy
const update = asyncHandler(async (req, res) => {
  const vacancy = await updateVacancy(
    req.params.id,

    req.body,
  );

  res.status(200).json(
    new ApiResponse(
      200,

      "Vacancy updated successfully",

      vacancy,
    ),
  );
});

// Delete vacancy
const remove = asyncHandler(async (req, res) => {
  await deleteVacancy(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Vacancy deleted successfully",
    ),
  );
});

module.exports = {
  create,

  getAll,

  getSingle,

  update,

  remove,
};
