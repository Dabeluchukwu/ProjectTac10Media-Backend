const mongoose = require("mongoose");


// Vacancy schema defines job posts in MongoDB
const vacancySchema = new mongoose.Schema(

  {


    // User who created the job post
    postedBy: {


      type: mongoose.Schema.Types.ObjectId,


      ref: "User",


      required: true,


    },



    // Job title
    title: {


      type: String,


      required: true,


      trim: true,


    },



    // Detailed job description
    description: {


      type: String,


      required: true,


      trim: true,


    },



    // Category of job
    category: {


      type: String,


      required: true,


      trim: true,


    },



    // Location of the job
    location: {


      type: String,


      required: true,


      trim: true,


    },



    // Payment/budget for the job
    budget: {


      type: Number,


      default: 0,


    },



    // Job status
    status: {


      type: String,


      enum: [


        "open",

        "closed",

      ],


      default: "open",


    },



    // Deadline for applications
    applicationDeadline: {


      type: Date,


    },


  },


  {


    // Automatically adds timestamps
    timestamps:true,


  }


);




// Create Vacancy model
const Vacancy = mongoose.model(

  "Vacancy",

  vacancySchema

);



module.exports = Vacancy;