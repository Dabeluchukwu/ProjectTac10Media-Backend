const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    // Student

    student: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    // Course being tracked

    course: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Course",

      required: true,
    },

    // Registration record

    registration: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Registration",

      required: true,
    },

    // Lessons completed by student

    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    // Completion percentage

    progressPercentage: {
      type: Number,

      default: 0,

      min: 0,

      max: 100,
    },

    status: {
      type: String,

      enum: ["not-started", "in-progress", "completed"],

      default: "not-started",
    },

    completedAt: {
      type: Date,

      default: null,
    },
  },

  {
    timestamps: true,
  },
);

// Prevent duplicate progress

progressSchema.index(
  {
    student: 1,

    course: 1,
  },

  {
    unique: true,
  },
);

const CourseProgress = mongoose.model(
  "CourseProgress",

  progressSchema,
);

module.exports = CourseProgress;
