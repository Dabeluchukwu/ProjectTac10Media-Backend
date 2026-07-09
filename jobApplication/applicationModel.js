const mongoose = require("mongoose");

// Application schema stores job applications
const applicationSchema = new mongoose.Schema(
  {
    // Person applying for the job (optional - for guests)
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ Guest applicant details (for non-logged-in users)
    applicantDetails: {
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },

    // Vacancy being applied for
    vacancy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vacancy",
      required: true,
    },

    // Applicant message/cover letter
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // CV or portfolio link
    attachment: {
      type: String,
      default: null,
    },

    // Application progress status
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Fix: Use async validation without 'next'
applicationSchema.pre("validate", function() {
  // Check if applicant is provided OR applicantDetails has email
  if (!this.applicant && (!this.applicantDetails || !this.applicantDetails.email)) {
    throw new Error("Either applicant ID or applicant details (email) is required");
  }
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;