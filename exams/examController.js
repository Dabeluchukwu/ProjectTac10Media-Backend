const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const {
  getExamByCourse,
  getStudentAttempt,
  startExam,
  submitExam,
  gradeEssay,
  getExamResults,
  retakeExam,
  // ✅ Add these instructor service functions
  createExam,
  updateExam,
  deleteExam,
  togglePublishExam,
  getExamById: getExamByIdService,
} = require("./examService");

// ==============================
// Student Routes
// ==============================

// Get exam for a course
const getExam = asyncHandler(async (req, res) => {
  const exam = await getExamByCourse(req.params.courseId);
  // ✅ Return null with success if no exam found
  res.status(200).json(
    new ApiResponse(200, "Exam fetched successfully", exam)
  );
});
// Start exam
const start = asyncHandler(async (req, res) => {
  const { examId, courseId } = req.body;
  const attempt = await startExam(req.user.id, examId, courseId);
  res.status(200).json(
    new ApiResponse(200, "Exam started successfully", attempt)
  );
});

// Retake exam
const retake = asyncHandler(async (req, res) => {
  const { examId, courseId } = req.body;
  const attempt = await retakeExam(req.user.id, examId, courseId);
  res.status(200).json(
    new ApiResponse(200, "Exam retake started successfully", attempt)
  );
});

// Submit exam
const submit = asyncHandler(async (req, res) => {
  console.log("📤 Exam controller - submit called");
  console.log("  User ID:", req.user.id);
  console.log("  Body:", req.body);
  
  const { examId, answers } = req.body;
  
  if (!examId) {
    throw new ApiError(400, "Exam ID is required");
  }
  
  if (!answers || !Array.isArray(answers)) {
    throw new ApiError(400, "Answers are required");
  }
  
  const attempt = await submitExam(req.user.id, examId, answers);
  
  res.status(200).json(
    new ApiResponse(200, "Exam submitted successfully", attempt)
  );
});

// Get exam results
const getResults = asyncHandler(async (req, res) => {
  const attempt = await getExamResults(req.user.id, req.params.examId);
  
  // Check if certificate exists
  const Certificate = require("../certificates/certificateModel");
  const certificate = await Certificate.findOne({
    student: req.user.id,
    course: attempt.course,
    status: "valid",
  });
  
  const result = {
    ...attempt.toObject(),
    certificate: certificate || null,
  };
  
  res.status(200).json(
    new ApiResponse(200, "Exam results fetched successfully", result)
  );
});

// Get student's attempt status
const getAttemptStatus = asyncHandler(async (req, res) => {
  const attempt = await getStudentAttempt(req.user.id, req.params.examId);
  res.status(200).json(
    new ApiResponse(200, "Attempt status fetched successfully", attempt || null)
  );
});

// Grade essay (instructor only)
const grade = asyncHandler(async (req, res) => {
  const { attemptId, questionIndex, pointsEarned } = req.body;
  const attempt = await gradeEssay(attemptId, questionIndex, pointsEarned);
  res.status(200).json(
    new ApiResponse(200, "Essay graded successfully", attempt)
  );
});

// ==============================
// Instructor Routes (NEW)
// ==============================

// Get exam by ID
const getExamById = asyncHandler(async (req, res) => {
  const exam = await getExamByIdService(req.params.id);
  res.status(200).json(
    new ApiResponse(200, "Exam fetched successfully", exam)
  );
});

// Create exam
const create = asyncHandler(async (req, res) => {
  const exam = await createExam(req.user.id, req.body);
  res.status(201).json(
    new ApiResponse(201, "Exam created successfully", exam)
  );
});

// Update exam
const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const exam = await updateExam(id, req.user.id, req.body);
  res.status(200).json(
    new ApiResponse(200, "Exam updated successfully", exam)
  );
});

// Delete exam
const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteExam(id, req.user.id);
  res.status(200).json(
    new ApiResponse(200, "Exam deleted successfully")
  );
});

// Toggle publish status
const togglePublish = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isPublished } = req.body;
  const exam = await togglePublishExam(id, req.user.id, isPublished);
  res.status(200).json(
    new ApiResponse(200, "Exam publish status updated successfully", exam)
  );
});

module.exports = {
  // Student routes
  getExam,
  start,
  submit,
  getResults,
  getAttemptStatus,
  grade,
  retake,
  // Instructor routes
  getExamById,
  create,
  update,
  remove,
  togglePublish,
};