// Handles Express request and response logic
const asyncHandler = require("../utils/asyncHandler");

// Standard API response format
const ApiResponse = require("../utils/ApiResponse");

// Import course service functions
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getAdminAllCoursesService,
  getInstructorCoursesService, 
  getInstructorStudentsService,
} = require("./courseService");

// Create a new course
const create = asyncHandler(async (req, res) => {
  const course = await createCourse(req.user.id, req.body);

  res.status(201).json(
    new ApiResponse(201, "Course created successfully", course)
  );
});

// Get all published courses
const getAll = asyncHandler(async (req, res) => {
  const courses = await getCourses();

  res.status(200).json(
    new ApiResponse(200, "Courses fetched successfully", courses)
  );
});

// Get one course
const getSingle = asyncHandler(async (req, res) => {
  const course = await getCourseById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Course fetched successfully", course)
  );
});

// Update course
const update = asyncHandler(async (req, res) => {
  const course = await updateCourse(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, "Course updated successfully", course)
  );
});

// Delete course
const remove = asyncHandler(async (req, res) => {
  await deleteCourse(req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Course deleted successfully")
  );
});

// ✅ Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isPublished } = req.body;
  
  const course = await updateCourse(id, { isPublished });

  res.status(200).json(
    new ApiResponse(200, "Course status updated successfully", course)
  );
});

// ✅ Get all courses for admin (including drafts)
const getAdminAllCourses = asyncHandler(async (req, res) => {
  const courses = await getAdminAllCoursesService();

  res.status(200).json(
    new ApiResponse(200, "All courses fetched successfully", courses)
  );
});

// ✅ Get instructor's courses
const getInstructorCourses = asyncHandler(async (req, res) => {
  console.log("🔍 Fetching instructor courses for user:", req.user.id);
  const courses = await getInstructorCoursesService(req.user.id);
  console.log(`✅ Found ${courses.length} courses`);
  res.status(200).json(
    new ApiResponse(200, "Instructor courses fetched successfully", courses)
  );
});

// ✅ Get instructor's students
const getInstructorStudents = asyncHandler(async (req, res) => {
  console.log("🔍 Fetching instructor students for user:", req.user.id);
  const students = await getInstructorStudentsService(req.user.id);
  console.log(`✅ Found ${students.length} students`);
  res.status(200).json(
    new ApiResponse(200, "Students fetched successfully", students)
  );
});

module.exports = {
  create,
  getAll,
  getSingle,
  update,
  remove,
  togglePublishStatus, 
  getAdminAllCourses,
  getInstructorCourses, 
  getInstructorStudents,
};