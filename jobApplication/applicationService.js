const Application = require("./applicationModel");
const Vacancy = require("../jobs/vacancyModel");
const ApiError = require("../utils/ApiError");
const { sendApplicationAcknowledgment, sendAdminNotification } = require("../extras/emailService");

// Create a job application
const createApplication = async (userId, applicationData) => {
  console.log("📤 createApplication called:");
  console.log("  User ID:", userId || "Guest");
  console.log("  Application Data:", applicationData);

  // Check vacancy exists
  const vacancy = await Vacancy.findById(applicationData.vacancy);
  if (!vacancy) {
    console.log("❌ Vacancy not found:", applicationData.vacancy);
    throw new ApiError(404, "Vacancy not found");
  }

  console.log("✅ Vacancy found:", vacancy.title);

  // ✅ Check if user already applied (only for logged-in users)
  if (userId) {
    const existingApplication = await Application.findOne({
      applicant: userId,
      vacancy: applicationData.vacancy,
    });

    if (existingApplication) {
      console.log("❌ User already applied for this vacancy");
      throw new ApiError(400, "Already applied for this vacancy");
    }
  }

  // ✅ Check if guest already applied via email
  if (applicationData.applicantDetails?.email) {
    const existingApplication = await Application.findOne({
      "applicantDetails.email": applicationData.applicantDetails.email,
      vacancy: applicationData.vacancy,
    });

    if (existingApplication) {
      console.log("❌ Email already applied for this vacancy");
      throw new ApiError(400, "Already applied for this vacancy with this email");
    }
  }

  // ✅ Build application data
  const applicationDataToCreate = {
    vacancy: applicationData.vacancy,
    message: applicationData.message,
    attachment: applicationData.attachment || null,
  };

  // If user is logged in, set the applicant field
  if (userId) {
    applicationDataToCreate.applicant = userId;
  }

  // Always set applicantDetails (for both guests and logged-in users)
  // For logged-in users, we can still store their details
  if (applicationData.applicantDetails) {
    applicationDataToCreate.applicantDetails = {
      firstName: applicationData.applicantDetails.firstName || "",
      lastName: applicationData.applicantDetails.lastName || "",
      email: applicationData.applicantDetails.email || "",
      phone: applicationData.applicantDetails.phone || "",
    };
  } else if (userId) {
    // If no applicantDetails provided but user is logged in, we could fetch from user
    // For now, just use empty values
    applicationDataToCreate.applicantDetails = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    };
  }

  console.log("📝 Creating application with:", applicationDataToCreate);

  // Create application
  const application = await Application.create(applicationDataToCreate);
  console.log("✅ Application created:", application._id);

  // ✅ Send acknowledgment email to applicant (for both guests and logged-in users)
  try {
    const applicantDetails = applicationData.applicantDetails || {
      firstName: applicationDataToCreate.applicantDetails?.firstName || "Applicant",
      lastName: applicationDataToCreate.applicantDetails?.lastName || "",
      email: applicationDataToCreate.applicantDetails?.email || "",
      phone: applicationDataToCreate.applicantDetails?.phone || "",
    };

    // Only send if we have an email
    if (applicantDetails.email) {
      await sendApplicationAcknowledgment(applicantDetails, vacancy.title);
      console.log("✅ Acknowledgment email sent to:", applicantDetails.email);
    } else {
      console.log("⚠️ No email provided, skipping acknowledgment email");
    }
  } catch (emailError) {
    console.error("❌ Failed to send acknowledgment email:", emailError.message);
    // Don't block the application if email fails
  }

  // ✅ Send admin notification (optional)
  try {
    const applicantDetails = applicationData.applicantDetails || {
      firstName: applicationDataToCreate.applicantDetails?.firstName || "Applicant",
      lastName: applicationDataToCreate.applicantDetails?.lastName || "",
      email: applicationDataToCreate.applicantDetails?.email || "",
      phone: applicationDataToCreate.applicantDetails?.phone || "",
      message: applicationData.message || "",
    };

    await sendAdminNotification(applicantDetails, vacancy.title, vacancy._id);
    console.log("✅ Admin notification sent");
  } catch (emailError) {
    console.error("❌ Failed to send admin notification:", emailError.message);
    // Don't block the application if email fails
  }

  return application;
};

// Get applications made by a user
const getMyApplications = async (userId) => {
  console.log("📤 getMyApplications called for user:", userId);
  
  const applications = await Application.find({
    applicant: userId,
  }).populate("vacancy");

  console.log(`✅ Found ${applications.length} applications`);
  return applications;
};

// Get applications for a vacancy
const getVacancyApplications = async (vacancyId) => {
  console.log("📤 getVacancyApplications called for vacancy:", vacancyId);
  
  const applications = await Application.find({
    vacancy: vacancyId,
  }).populate("applicant", "firstName lastName email");

  console.log(`✅ Found ${applications.length} applications`);
  return applications;
};

// Get single application
const getApplicationById = async (applicationId) => {
  console.log("📤 getApplicationById called for:", applicationId);
  
  const application = await Application.findById(applicationId)
    .populate("vacancy")
    .populate("applicant", "firstName lastName email");

  if (!application) {
    console.log("❌ Application not found");
    throw new ApiError(404, "Application not found");
  }

  console.log("✅ Application found:", application._id);
  return application;
};

// Update application status
const updateApplication = async (applicationId, updateData) => {
  console.log("📤 updateApplication called for:", applicationId);
  console.log("  Update data:", updateData);
  
  const application = await Application.findByIdAndUpdate(
    applicationId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!application) {
    console.log("❌ Application not found");
    throw new ApiError(404, "Application not found");
  }

  console.log("✅ Application updated:", application._id);
  return application;
};

// Delete application
const deleteApplication = async (applicationId) => {
  console.log("📤 deleteApplication called for:", applicationId);
  
  const application = await Application.findByIdAndDelete(applicationId);

  if (!application) {
    console.log("❌ Application not found");
    throw new ApiError(404, "Application not found");
  }

  console.log("✅ Application deleted:", application._id);
  return application;
};

module.exports = {
  createApplication,
  getMyApplications,
  getVacancyApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};