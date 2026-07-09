const mongoose = require("mongoose");

// Lesson schema

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,

      required: true,

      trim: true,
    },

    description: {
      type: String,

      trim: true,

      default: "",
    },

    videoUrl: {
      type: String,

      default: null,
    },

    resourceUrl: {
      type: String,

      default: null,
    },

    duration: {
      type: String,

      default: null,
    },

    order: {
      type: Number,

      default: 0,
    },

    isPreview: {
      type: Boolean,

      default: false,
    },
  },

  {
    _id: true,
  },
);

// Module schema

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,

      required: true,

      trim: true,
    },

    description: {
      type: String,

      default: "",
    },

    order: {
      type: Number,

      default: 0,
    },

    lessons: [lessonSchema],
  },

  {
    _id: true,
  },
);

// Course schema

const courseSchema = new mongoose.Schema(
  {
    // Instructor who created course

    instructor: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    title: {
      type: String,

      required: true,

      trim: true,
    },

    description: {
      type: String,

      required: true,

      trim: true,
    },

    image: {
      type: String,

      default: null,
    },

    price: {
      type: Number,

      default: 0,
    },

    duration: {
      type: String,

      required: true,
    },

    level: {
      type: String,

      enum: ["beginner", "intermediate", "advanced"],

      default: "beginner",
    },

    // Course structure

    modules: [moduleSchema],

    // What student learns

    learningOutcomes: [
      {
        type: String,

        trim: true,
      },
    ],

    // Requirements before joining

    requirements: [
      {
        type: String,

        trim: true,
      },
    ],

    isPublished: {
      type: Boolean,

      default: false,
    },
  },

  {
    timestamps: true,
  },
);

const Course = mongoose.model(
  "Course",

  courseSchema,
);

module.exports = Course;
