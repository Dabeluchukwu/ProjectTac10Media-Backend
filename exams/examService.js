const Exam = require("./examModel");
const ExamAttempt = require("./examAttemptModel");
const CourseProgress = require("../courseProgress/progressModel");
const Certificate = require("../certificates/certificateModel");
const ApiError = require("../utils/ApiError");

// Get exam for a course
const getExamByCourse = async (courseId) => {
  const exam = await Exam.findOne({ course: courseId, isPublished: true });
  // ✅ Return null instead of throwing 404
  return exam;
};
// Get student's exam attempt
const getStudentAttempt = async (studentId, examId) => {
  const attempt = await ExamAttempt.findOne({
    student: studentId,
    exam: examId,
  });
  return attempt;
};

// Start exam
const startExam = async (studentId, examId, courseId) => {
  // Check if student has completed all lessons
  const progress = await CourseProgress.findOne({
    student: studentId,
    course: courseId,
  });

  if (!progress) {
    throw new ApiError(403, "You are not enrolled in this course");
  }

  if (progress.progressPercentage < 100) {
    throw new ApiError(403, "You must complete all lessons before taking the exam");
  }

  // Check if already attempted
  const existingAttempt = await ExamAttempt.findOne({
    student: studentId,
    exam: examId,
  });

  if (existingAttempt) {
    if (existingAttempt.status === "submitted" || existingAttempt.status === "graded") {
      throw new ApiError(400, "You have already submitted this exam");
    }
    return existingAttempt;
  }

  // Create new attempt
  const attempt = await ExamAttempt.create({
    student: studentId,
    exam: examId,
    course: courseId,
    status: "in-progress",
  });

  return attempt;
};

// Retake exam (allow student to retake failed exam)
const retakeExam = async (studentId, examId, courseId) => {
  console.log("📤 retakeExam called:", { studentId, examId, courseId });
  
  // Check if student has completed all lessons
  const progress = await CourseProgress.findOne({
    student: studentId,
    course: courseId,
  });

  if (!progress) {
    throw new ApiError(403, "You are not enrolled in this course");
  }

  if (progress.progressPercentage < 100) {
    throw new ApiError(403, "You must complete all lessons before taking the exam");
  }

  // Find existing attempt
  const existingAttempt = await ExamAttempt.findOne({
    student: studentId,
    exam: examId,
  });

  if (!existingAttempt) {
    throw new ApiError(404, "No exam attempt found");
  }

  // Only allow retake if failed
  if (existingAttempt.passed) {
    throw new ApiError(400, "You have already passed this exam");
  }

  // ✅ Delete the old attempt so student can retake
  await ExamAttempt.deleteOne({
    student: studentId,
    exam: examId,
  });

  console.log(`🗑️ Deleted old attempt for student ${studentId}`);

  // ✅ Create new attempt
  const attempt = await ExamAttempt.create({
    student: studentId,
    exam: examId,
    course: courseId,
    status: "in-progress",
    answers: [],
    score: 0,
    passed: false,
  });

  console.log(`✅ Created new attempt for student ${studentId}`);
  return attempt;
};


// Submit exam 
const submitExam = async (studentId, examId, answers) => {
  console.log("📤 submitExam called:", { studentId, examId, answers });
  
  const attempt = await ExamAttempt.findOne({
    student: studentId,
    exam: examId,
  });

  if (!attempt) {
    console.log("❌ Exam attempt not found");
    throw new ApiError(404, "Exam attempt not found");
  }

  if (attempt.status === "submitted" || attempt.status === "graded") {
    throw new ApiError(400, "Exam already submitted");
  }

  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  // ✅ Log exam questions
  console.log("📚 Exam questions:", exam.questions.length);
  console.log("📚 Answers received:", answers.length);

  // Grade the exam
  let totalPoints = 0;
  let earnedPoints = 0;
  const gradedAnswers = [];

  exam.questions.forEach((question, index) => {
    const userAnswer = answers[index]?.answer || answers[index] || "";
    const points = question.points || 1;
    totalPoints += points;

    let isCorrect = false;
    let pointsEarned = 0;

    console.log(`🔍 Question ${index + 1}:`, {
      question: question.question,
      type: question.type,
      correctAnswer: question.correctAnswer,
      userAnswer: userAnswer,
      points: points
    });

    if (question.type === "essay") {
      // Essay questions need manual grading
      pointsEarned = 0;
      isCorrect = false;
    } else {
      // Auto-grade multiple choice and true/false
      // ✅ Compare as strings to handle type mismatches
      const userAnswerStr = String(userAnswer).trim().toLowerCase();
      const correctAnswerStr = String(question.correctAnswer).trim().toLowerCase();
      
      if (userAnswerStr === correctAnswerStr) {
        isCorrect = true;
        pointsEarned = points;
        console.log(`  ✅ Correct! Earned ${pointsEarned} points`);
      } else {
        console.log(`  ❌ Incorrect. User: "${userAnswerStr}", Correct: "${correctAnswerStr}"`);
      }
    }

    gradedAnswers.push({
      questionId: question._id,
      answer: userAnswer,
      isCorrect,
      pointsEarned,
    });

    earnedPoints += pointsEarned;
  });

  console.log(`📊 Total Points: ${totalPoints}, Earned Points: ${earnedPoints}`);

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = score >= exam.passingScore;

  console.log(`📊 Score: ${score}%, Passed: ${passed}, Passing Score: ${exam.passingScore}%`);

  // ✅ Update attempt with graded answers
  attempt.answers = gradedAnswers;
  attempt.score = score;
  attempt.passed = passed;
  attempt.submittedAt = new Date();
  attempt.status = "submitted";

  await attempt.save();
  console.log(`✅ Exam submitted! Score: ${score}%, Passed: ${passed}`);

  // ✅ If passed, generate certificate
  if (passed) {
    const Certificate = require("../certificates/certificateModel");
    const Registration = require("../courseRegistration/registrationModel");
    
    const existingCertificate = await Certificate.findOne({
      student: studentId,
      course: attempt.course,
    });

    if (!existingCertificate) {
      const registration = await Registration.findOne({
        student: studentId,
        course: attempt.course,
        paymentStatus: "paid",
        status: "approved",
      });

      if (registration) {
        const certificateNumber = `CERT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        await Certificate.create({
          certificateNumber,
          student: studentId,
          course: attempt.course,
          registration: registration._id,
          issuedBy: registration.student,
          status: "valid",
          issuedAt: new Date(),
        });
        console.log(`✅ Certificate generated for student ${studentId}`);
      }
    }
  }

  return attempt;
};

// Grade essay questions (instructor)
const gradeEssay = async (attemptId, questionIndex, pointsEarned) => {
  const attempt = await ExamAttempt.findById(attemptId);
  if (!attempt) {
    throw new ApiError(404, "Attempt not found");
  }

  if (attempt.status !== "submitted") {
    throw new ApiError(400, "Exam must be submitted before grading");
  }

  const answer = attempt.answers[questionIndex];
  if (!answer) {
    throw new ApiError(404, "Answer not found");
  }

  answer.pointsEarned = pointsEarned;
  answer.isCorrect = pointsEarned > 0;

  // Recalculate score
  const exam = await Exam.findById(attempt.exam);
  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  let totalPoints = 0;
  let earnedPoints = 0;
  attempt.answers.forEach((ans) => {
    totalPoints += exam.questions.find(q => q._id.toString() === ans.questionId.toString())?.points || 1;
    earnedPoints += ans.pointsEarned || 0;
  });

  attempt.score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  attempt.passed = attempt.score >= exam.passingScore;
  attempt.status = "graded";

  await attempt.save();

  // ✅ If passed, generate certificate
  if (attempt.passed) {
    const Certificate = require("../certificates/certificateModel");
    const Registration = require("../courseRegistration/registrationModel");
    const registration = await Registration.findOne({
      student: attempt.student,
      course: attempt.course,
      paymentStatus: "paid",
      status: "approved",
    });

    if (registration) {
      const existingCertificate = await Certificate.findOne({
        student: attempt.student,
        course: attempt.course,
      });

      if (!existingCertificate) {
        const certificateNumber = `CERT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        await Certificate.create({
          certificateNumber,
          student: attempt.student,
          course: attempt.course,
          registration: registration._id,
          issuedBy: registration.student,
          status: "valid",
          issuedAt: new Date(),
        });
        console.log(`✅ Certificate generated for student ${attempt.student}`);
      }
    }
  }

  return attempt;
};

// Get student's exam results
const getExamResults = async (studentId, examId) => {
  const attempt = await ExamAttempt.findOne({
    student: studentId,
    exam: examId,
  }).populate("exam");

  if (!attempt) {
    throw new ApiError(404, "Exam attempt not found");
  }

  return attempt;
};


// ==============================
// INSTRUCTOR FUNCTIONS
// ==============================

// Get exam by ID (instructor)
const getExamById = async (examId) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }
  return exam;
};

// Create exam (instructor)
const createExam = async (instructorId, examData) => {
  // Check if exam already exists for this course
  const existingExam = await Exam.findOne({ course: examData.course });
  if (existingExam) {
    throw new ApiError(400, "Exam already exists for this course");
  }

  const exam = await Exam.create({
    ...examData,
  });

  return exam;
};

// Update exam (instructor)
const updateExam = async (examId, instructorId, updateData) => {
  const exam = await Exam.findOne({ _id: examId });
  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  // Don't allow changing the course
  delete updateData.course;

  Object.assign(exam, updateData);
  await exam.save();
  return exam;
};

// Delete exam (instructor)
const deleteExam = async (examId, instructorId) => {
  const exam = await Exam.findOne({ _id: examId });
  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  await exam.deleteOne();
  return exam;
};

// Toggle publish status (instructor)
const togglePublishExam = async (examId, instructorId, isPublished) => {
  const exam = await Exam.findOne({ _id: examId });
  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  exam.isPublished = isPublished;
  await exam.save();
  return exam;
};

module.exports = {
  getExamByCourse,
  getStudentAttempt,
  startExam,
  submitExam,
  gradeEssay,
  getExamResults,
  retakeExam,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  togglePublishExam,
};