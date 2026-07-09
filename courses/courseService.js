const Course = require("./courseModel");
const Registration = require("../courseRegistration/registrationModel");
const ApiError = require("../utils/ApiError");

// Create a new course
const createCourse = async (instructorId, courseData) => {
  const course = await Course.create({
    instructor: instructorId,
    ...courseData,
  });
  return course;
};

// Get all published courses
const getCourses = async () => {
  const courses = await Course.find({
    isPublished: true,
  }).populate("instructor", "firstName lastName email");
  return courses;
};

// Get single course
const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId).populate(
    "instructor",
    "firstName lastName email"
  );

  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  return course;
};

// Update course
const updateCourse = async (courseId, updateData) => {
  const course = await Course.findByIdAndUpdate(
    courseId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  return course;
};

// Delete course
const deleteCourse = async (courseId) => {
  const course = await Course.findByIdAndDelete(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  return course;
};

// Get all courses for admin (including drafts)
const getAdminAllCoursesService = async () => {
  const courses = await Course.find()
    .populate("instructor", "firstName lastName email")
    .sort({ createdAt: -1 });
  return courses;
};

// ✅ Get instructor's courses
const getInstructorCoursesService = async (userId) => {
  console.log("🔍 getInstructorCoursesService called for userId:", userId);
  
  const courses = await Course.find({ instructor: userId })
    .populate("instructor", "firstName lastName email")
    .sort({ createdAt: -1 });
  
  console.log(`✅ Found ${courses.length} courses for instructor`);
  return courses;
};

// ✅ Get instructor's students
const getInstructorStudentsService = async (userId) => {
  console.log("🔍 getInstructorStudentsService called for userId:", userId);
  
  // Get all courses for this instructor
  const courses = await Course.find({ instructor: userId });
  const courseIds = courses.map(c => c._id);
  
  console.log(`📚 Found ${courseIds.length} courses for instructor`);
  
  if (courseIds.length === 0) {
    console.log("ℹ️ No courses found for instructor");
    return [];
  }
  
  // Get all registrations for these courses
  const registrations = await Registration.find({
    course: { $in: courseIds },
    paymentStatus: "paid",
    status: "approved",
  })
    .populate("student", "firstName lastName email phone")
    .populate("course", "title");
  
  console.log(`📊 Found ${registrations.length} registrations`);
  
  // Group by student
  const studentMap = new Map();
  
  registrations.forEach((reg) => {
    const student = reg.student;
    if (!student) return;
    
    const studentId = student._id.toString();
    if (!studentMap.has(studentId)) {
      studentMap.set(studentId, {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone || "",
        courses: [],
        enrolledAt: reg.createdAt,
        progress: 0,
      });
    }
    
    studentMap.get(studentId).courses.push({
      courseId: reg.course._id,
      courseTitle: reg.course.title,
      enrolledAt: reg.createdAt,
    });
  });
  
  const result = Array.from(studentMap.values());
  console.log(`✅ Found ${result.length} unique students`);
  
  return result;
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getAdminAllCoursesService,
  getInstructorCoursesService,
  getInstructorStudentsService,
};