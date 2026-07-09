const mongoose = require("mongoose");


// Media schema stores uploaded files information
const mediaSchema = new mongoose.Schema(

  {


    // User who uploaded the file
    uploadedBy: {


      type: mongoose.Schema.Types.ObjectId,


      ref: "User",


      required: true,


    },



    // Cloudinary URL
    url: {


      type: String,


      required: true,


    },



    // Cloudinary public ID
    // Used when deleting files
    publicId: {


      type: String,


      required: true,


    },



    // Type of media
    mediaType: {


      type: String,


      enum: [


        "image",

        "video",

        "document"


      ],


      required: true,


    },



    // Where this media belongs
    // Example:
    // course image
    // profile image
    // portfolio
    category: {


      type: String,


      enum: [


        "profile",

        "course",

        "portfolio",

        "advertisement",

        "other"


      ],


      default:"other",


    },



    // Original filename
    filename: {


      type:String,


    },


  },


  {


    timestamps:true,


  }


);





const Media = mongoose.model(

  "Media",

  mediaSchema

);



module.exports = Media;