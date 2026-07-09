const Registration = require("./registrationModel");

const Course = require("../courses/courseModel");

const CourseProgress = require("../courseProgress/progressModel");

const ApiError = require("../utils/ApiError");


// Create course registration
const createRegistration = async (studentId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const existingRegistration = await Registration.findOne({
    student: studentId,
    course: courseId,
  });
  if (existingRegistration) {
    throw new ApiError(400, "Already registered for this course");
  }

  const registration = await Registration.create({
    student: studentId,
    course: courseId,
    amount: course.price,
    paymentStatus: "pending", // ✅ This should match the enum
    status: "pending",
  });

  // ✅ AUTO-CREATE PROGRESS RECORD
  await CourseProgress.create({
    student: studentId,
    course: courseId,
    registration: registration._id,
    status: "not-started",
    progressPercentage: 0,
    completedLessons: [],
  });

  await registration.populate("course");
  return registration;
};

// Get student's registrations
const getStudentRegistrations = async (studentId) => {
  const registrations = await Registration.find({
    student: studentId,
  })

    .populate("course");

  return registrations;
};

// Get single registration
const getRegistrationById = async (registrationId) => {
  const registration = await Registration.findById(registrationId)

    .populate("course")

    .populate(
      "student",

      "firstName lastName email",
    );

  if (!registration) {
    throw new ApiError(
      404,

      "Registration not found",
    );
  }

  return registration;
};

// Update registration
const updateRegistration = async (
  registrationId,

  updateData,
) => {
  const registration = await Registration.findByIdAndUpdate(
    registrationId,

    updateData,

    {
      new: true,

      runValidators: true,
    },
  );

  if (!registration) {
    throw new ApiError(
      404,

      "Registration not found",
    );
  }

  return registration;
};

// Delete registration
const deleteRegistration = async (registrationId) => {
  const registration = await Registration.findByIdAndDelete(registrationId);

  if (!registration) {
    throw new ApiError(
      404,

      "Registration not found",
    );
  }

  return registration;
};

module.exports = {
  createRegistration,

  getStudentRegistrations,

  getRegistrationById,

  updateRegistration,

  deleteRegistration,
};
