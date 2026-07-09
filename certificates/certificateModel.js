const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    // Unique certificate identifier

    certificateNumber: {
      type: String,

      required: true,

      unique: true,

      uppercase: true,

      trim: true,
    },

    // Student receiving certificate

    student: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    // Completed course

    course: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Course",

      required: true,
    },

    // Related registration

    registration: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Registration",

      required: true,
    },

    // Admin who issued certificate

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    status: {
      type: String,

      enum: ["valid", "revoked"],

      default: "valid",
    },

    issuedAt: {
      type: Date,

      default: Date.now,
    },

    revokedAt: {
      type: Date,

      default: null,
    },

    revocationReason: {
      type: String,

      default: null,
    },
  },

  {
    timestamps: true,
  },
);

// Prevent duplicate certificate for same student/course

certificateSchema.index(
  {
    student: 1,

    course: 1,
  },

  {
    unique: true,
  },
);

const Certificate = mongoose.model(
  "Certificate",

  certificateSchema,
);

module.exports = Certificate;
