const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      trim: true,
    },

    // Controls user permissions
role: {

  type: String,

  enum: [

    "superAdmin",

    "admin",

    "client",

    "student",

    "instructor",

  ],

  default: "client",

},

    profileImage: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);


const User = mongoose.model("User", userSchema);


module.exports = User;