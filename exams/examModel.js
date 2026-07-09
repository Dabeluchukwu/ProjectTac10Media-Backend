const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["multiple-choice", "true-false", "essay"],
    required: true,
    default: "multiple-choice",
  },
  options: {
    type: [String],
    default: [],
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  points: {
    type: Number,
    default: 1,
    min: 1,
  },
  explanation: {
    type: String,
    default: "",
  },
}, {
  _id: true,
});

const examSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    unique: true,
  },
 
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
    default: "",
  },
  passingScore: {
    type: Number,
    required: true,
    default: 70,
    min: 0,
    max: 100,
  },
  timeLimit: {
    type: Number,
    default: 60,
    min: 0,
  },
  questions: [questionSchema],
  totalPoints: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// ✅ Temporarily comment out the pre-save hook
// examSchema.pre("save", function(next) {
//   let total = 0;
//   this.questions.forEach(q => {
//     total += q.points || 1;
//   });
//   this.totalPoints = total;
//   next();
// });



const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;