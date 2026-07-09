const Vacancy = require("./vacancyModel");

const ApiError = require("../utils/ApiError");

// Create a new vacancy
const createVacancy = async (
  userId,

  vacancyData,
) => {
  // Attach creator of vacancy
  const vacancy = await Vacancy.create({
    postedBy: userId,

    ...vacancyData,
  });

  return vacancy;
};

// Get all available vacancies
const getVacancies = async () => {
  const vacancies = await Vacancy.find()

    // Show who posted the job
    .populate(
      "postedBy",

      "firstName lastName email",
    );

  return vacancies;
};

// Get single vacancy
const getVacancyById = async (vacancyId) => {
  const vacancy = await Vacancy.findById(vacancyId)

    .populate(
      "postedBy",

      "firstName lastName email",
    );

  if (!vacancy) {
    throw new ApiError(
      404,

      "Vacancy not found",
    );
  }

  return vacancy;
};

// Update vacancy
const updateVacancy = async (
  vacancyId,

  updateData,
) => {
  const vacancy = await Vacancy.findByIdAndUpdate(
    vacancyId,

    updateData,

    {
      new: true,

      runValidators: true,
    },
  );

  if (!vacancy) {
    throw new ApiError(
      404,

      "Vacancy not found",
    );
  }

  return vacancy;
};

// Delete vacancy
const deleteVacancy = async (vacancyId) => {
  const vacancy = await Vacancy.findByIdAndDelete(vacancyId);

  if (!vacancy) {
    throw new ApiError(
      404,

      "Vacancy not found",
    );
  }

  return vacancy;
};

module.exports = {
  createVacancy,

  getVacancies,

  getVacancyById,

  updateVacancy,

  deleteVacancy,
};
