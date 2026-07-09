// Handles Express request and response logic
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Import application service functions
const {
  createApplication,
  getMyApplications,
  getVacancyApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} = require("./applicationService");

// Apply for a vacancy - PUBLIC
const create = asyncHandler(async (req, res) => {
  console.log("📤 Create application called");
  console.log("  User ID:", req.user?.id || "Guest");
  console.log("  Request body:", req.body);
  
  const userId = req.user?.id || null;
  
  if (!userId && !req.body.applicantDetails) {
    throw new ApiError(400, "Please provide your details (firstName, lastName, email)");
  }

  if (!userId && req.body.applicantDetails) {
    const { firstName, lastName, email } = req.body.applicantDetails;
    if (!firstName || !lastName || !email) {
      throw new ApiError(400, "Please provide firstName, lastName, and email");
    }
  }

  const application = await createApplication(userId, req.body);

  res.status(201).json(
    new ApiResponse(201, "Application submitted successfully", application)
  );
});

// Get applications submitted by current user
const getMine = asyncHandler(async (req, res) => {
  console.log("📤 getMine called for user:", req.user.id);
  
  const applications = await getMyApplications(req.user.id);

  res.status(200).json(
    new ApiResponse(200, "Applications fetched successfully", applications)
  );
});

// Get all applicants for a vacancy
const getForVacancy = asyncHandler(async (req, res) => {
  console.log("📤 getForVacancy called for vacancy:", req.params.vacancyId);
  
  const applications = await getVacancyApplications(req.params.vacancyId);

  res.status(200).json(
    new ApiResponse(200, "Vacancy applications fetched successfully", applications)
  );
});

// Get one application
const getSingle = asyncHandler(async (req, res) => {
  console.log("📤 getSingle called for application:", req.params.id);
  
  const application = await getApplicationById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Application fetched successfully", application)
  );
});

// Update application status
const update = asyncHandler(async (req, res) => {
  console.log("📤 update called for application:", req.params.id);
  console.log("  Update data:", req.body);
  
  const application = await updateApplication(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, "Application updated successfully", application)
  );
});

// Delete application
const remove = asyncHandler(async (req, res) => {
  console.log("📤 remove called for application:", req.params.id);
  
  await deleteApplication(req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Application deleted successfully")
  );
});

// ✅ Check if logged-in user has already applied
const checkApplication = asyncHandler(async (req, res) => {
  const { vacancy } = req.query;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(200).json({
      success: true,
      hasApplied: false,
      message: "Guest user - no application check",
    });
  }

  if (!vacancy) {
    return res.status(400).json({
      success: false,
      message: "Vacancy ID is required",
    });
  }

  const Application = require("./applicationModel");

  const application = await Application.findOne({
    applicant: userId,
    vacancy: vacancy,
  });

  const hasApplied = !!application;

  console.log("✅ Check result for user:", userId, "hasApplied:", hasApplied);

  res.status(200).json({
    success: true,
    hasApplied,
    message: hasApplied ? "Already applied" : "Not applied yet",
  });
});

// ✅ Check if email has already applied (for guests)
const checkApplicationByEmail = asyncHandler(async (req, res) => {
  const { vacancy, email } = req.query;

  console.log("📤 checkApplicationByEmail called:", { vacancy, email });

  if (!vacancy || !email) {
    return res.status(400).json({
      success: false,
      message: "Vacancy ID and email are required",
    });
  }

  const Application = require("./applicationModel");

  const application = await Application.findOne({
    vacancy: vacancy,
    "applicantDetails.email": email,
  });

  const hasApplied = !!application;

  console.log("✅ Email check result:", { email, hasApplied });

  res.status(200).json({
    success: true,
    hasApplied,
    message: hasApplied ? "Already applied with this email" : "Email not used yet",
  });
});

module.exports = {
  create,
  getMine,
  getForVacancy,
  getSingle,
  update,
  remove,
  checkApplication,
  checkApplicationByEmail,
};