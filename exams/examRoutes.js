const express = require("express");
const router = express.Router();
const {
  getExam,
  start,
  submit,
  getResults,
  getAttemptStatus,
  grade,
  retake,
 
  create,
  update,
  remove,
  togglePublish,
  getExamById,
} = require("./examController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// ==============================
// Student Routes
// ==============================

// Get exam for a course
router.get("/course/:courseId", authMiddleware, getExam);

// Get attempt status
router.get("/:examId/status", authMiddleware, getAttemptStatus);

// Start exam
router.post("/start", authMiddleware, authorizeRoles("student"), start);

// Retake exam (for failed attempts)
router.post("/retake", authMiddleware, authorizeRoles("student"), retake);

// Submit exam
router.post("/submit", authMiddleware, authorizeRoles("student"), submit);

// Get exam results
router.get("/:examId/results", authMiddleware, getResults);

// ==============================
// Instructor Routes
// ==============================

// ✅ Get exam by ID (instructor)
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("instructor", "admin"),
  getExamById,
);

// ✅ Create exam
router.post("/", authMiddleware, authorizeRoles("instructor", "admin"), create);

// ✅ Update exam
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("instructor", "admin"),
  update,
);

// ✅ Delete exam
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("instructor", "admin"),
  remove,
);

// ✅ Toggle publish status
router.patch(
  "/:id/publish",
  authMiddleware,
  authorizeRoles("instructor", "admin"),
  togglePublish,
);

// Grade essay questions
router.post(
  "/grade",
  authMiddleware,
  authorizeRoles("instructor", "admin"),
  grade,
);

module.exports = router;
