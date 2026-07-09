const CourseProgress = require("./progressModel");

const Course = require("../courses/courseModel");

const Registration = require("../courseRegistration/registrationModel");

const ApiError = require("../utils/ApiError");

const mongoose = require("mongoose");

// Create progress record

const createProgress = async (
  studentId,

  progressData,
) => {
  const registration = await Registration.findOne({
    _id: progressData.registration,

    student: studentId,

    course: progressData.course,

    paymentStatus: "paid",

    status: "approved",
  });
  if (!registration) {
    throw new ApiError(
      403,

      "You do not have access to this course",
    );
  }

  const existingProgress = await CourseProgress.findOne({
    student: studentId,

    course: progressData.course,
  });

  if (existingProgress) {
    return existingProgress;
  }

  const progress = await CourseProgress.create({
    student: studentId,

    course: progressData.course,

    registration: progressData.registration,
  });

  return progress;
};

// Get student's course progress

const getStudentProgress = async (
  studentId,

  courseId,
) => {
  const progress = await CourseProgress.findOne({
    student: studentId,

    course: courseId,
  })

    .populate(
      "course",

      "title modules",
    );

  if (!progress) {
    throw new ApiError(
      404,

      "Course progress not found",
    );
  }

  return progress;
};

// Complete lesson

// Complete lesson
const completeLesson = async (studentId, courseId, lessonId) => {
  console.log("📤 completeLesson called:");
  console.log("  studentId:", studentId);
  console.log("  courseId:", courseId);
  console.log("  lessonId:", lessonId);
  console.log("  lessonId type:", typeof lessonId);

  const registration = await Registration.findOne({
    student: studentId,
    course: courseId,
    paymentStatus: "paid",
    status: "approved",
  });

  if (!registration) {
    console.log("❌ Registration not found or not approved");
    throw new ApiError(403, "You do not have access to this course");
  }

  const progress = await CourseProgress.findOne({
    student: studentId,
    course: courseId,
  });

  if (!progress) {
    console.log("❌ Progress not found for student:", studentId, "course:", courseId);
    throw new ApiError(404, "Course progress not found");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // ✅ LOG ALL LESSON IDs FOR DEBUGGING
  console.log("🔍 Course ID:", courseId);
  console.log("🔍 Course title:", course.title);
  console.log("🔍 Looking for lessonId:", lessonId);
  console.log("🔍 Lesson ID type:", typeof lessonId);
  
  let totalLessons = 0;
  let lessonExists = false;
  let lessonIndex = -1;

  course.modules.forEach((module, mIdx) => {
    module.lessons.forEach((lesson, lIdx) => {
      totalLessons++;
      const lessonIdStr = lesson._id.toString();
      const providedLessonIdStr = lessonId.toString();
      console.log(`  Checking lesson ${mIdx}-${lIdx}:`);
      console.log(`    DB ID: ${lessonIdStr}`);
      console.log(`    Provided: ${providedLessonIdStr}`);
      console.log(`    Match: ${lessonIdStr === providedLessonIdStr}`);
      
      if (lessonIdStr === providedLessonIdStr) {
        lessonExists = true;
        lessonIndex = totalLessons - 1;
        console.log("  ✅ MATCH FOUND at position:", lessonIndex);
      }
    });
  });

  if (!lessonExists) {
    console.log("❌ Lesson does not belong to this course");
    console.log("  Provided lessonId:", lessonId);
    console.log("  All lesson IDs in course:");
    course.modules.forEach((module, mIdx) => {
      module.lessons.forEach((lesson, lIdx) => {
        console.log(`    ${mIdx}-${lIdx}: ${lesson._id.toString()} - ${lesson.title}`);
      });
    });
    throw new ApiError(400, "Lesson does not belong to this course");
  }

  if (totalLessons === 0) {
    throw new ApiError(400, "This course has no lessons");
  }

  console.log(`📊 Total lessons: ${totalLessons}, Completed: ${progress.completedLessons.length}`);

  // ✅ Add lesson to completed list if not already
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    console.log("✅ Added lesson to completed list");
  } else {
    console.log("ℹ️ Lesson already completed");
  }

  const completedCount = progress.completedLessons.length;
  progress.progressPercentage = Math.round((completedCount / totalLessons) * 100);

  if (progress.progressPercentage >= 100) {
    progress.progressPercentage = 100;
    progress.status = "completed";
    progress.completedAt = new Date();
    console.log("🎉 Course completed!");
  } else {
    progress.status = "in-progress";
  }

  await progress.save();
  console.log(`✅ Progress updated: ${progress.progressPercentage}%, Status: ${progress.status}`);

  return progress;
};
// Get all progress (Admin)

const getAllProgress = async () => {
  return await CourseProgress.find()

    .populate(
      "student",

      "firstName lastName email",
    )

    .populate(
      "course",

      "title",
    );
};

module.exports = {
  createProgress,

  getStudentProgress,

  completeLesson,

  getAllProgress,
};
