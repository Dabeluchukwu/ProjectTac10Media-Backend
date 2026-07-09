const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const {
  createProgress,

  getStudentProgress,

  completeLesson,

  getAllProgress,
} = require("./progressService");

const {
  createProgressValidation,

  completeLessonValidation,
} = require("./progressValidation");

// Start course progress

const startCourseProgress = asyncHandler(async (req, res) => {
  const { error } = createProgressValidation.validate(req.body);

  if (error) {
    throw new Error(error.details[0].message);
  }

  const progress = await createProgress(
    req.user.id,

    req.body,
  );

  res.status(201).json(
    new ApiResponse(
      201,

      "Course progress started successfully",

      progress,
    ),
  );
});

// Get student's own progress

const getMyCourseProgress = asyncHandler(async (req, res) => {
  const progress = await getStudentProgress(
    req.user.id,

    req.params.courseId,
  );

  res.status(200).json(
    new ApiResponse(
      200,

      "Course progress fetched successfully",

      progress,
    ),
  );
});

// Complete lesson

const markLessonComplete = asyncHandler(async (req, res) => {
  const { error } = completeLessonValidation.validate(req.body);

  if (error) {
    throw new Error(error.details[0].message);
  }

  const progress = await completeLesson(
    req.user.id,

    req.params.courseId,

    req.body.lessonId,
  );

  res.status(200).json(
    new ApiResponse(
      200,

      "Lesson completed successfully",

      progress,
    ),
  );
});

// Admin view all progress

const getCourseProgressList = asyncHandler(async (req, res) => {
  const progress = await getAllProgress();

  res.status(200).json(
    new ApiResponse(
      200,

      "Course progress fetched successfully",

      progress,
    ),
  );
});

module.exports = {
  startCourseProgress,

  getMyCourseProgress,

  markLessonComplete,

  getCourseProgressList,
};
