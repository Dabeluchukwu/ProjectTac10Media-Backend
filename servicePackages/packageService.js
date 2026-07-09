// const ServicePackage = require("./packageModel");

// const Service = require("../services/serviceModel");

// const ApiError = require("../utils/ApiError");

// const slugify = require("slugify");

// const mongoose = require("mongoose");

// // Create package

// const createPackage = async (
//   packageData,

//   userId,
// ) => {
//   const slug = slugify(packageData.name, {
//     lower: true,
//     strict: true,
//   });

//   const existingPackage = await ServicePackage.findOne({
//     slug,
//   });

//   if (existingPackage) {
//     throw new ApiError(400, "Package already exists");
//   }

//   const servicesExist = await Service.find({
//     _id: {
//       $in: packageData.services,
//     },

//     isActive: true,
//   });

//   if (servicesExist.length !== packageData.services.length) {
//     throw new ApiError(400, "One or more services are invalid");
//   }

//   const servicePackage = await ServicePackage.create({
//     ...packageData,

//     slug,

//     createdBy: userId,
//   });

//   return servicePackage;
// };

// // Get packages

// const getPackages = async () => {
//   const packages = await ServicePackage.find({
//     isActive: true,
//   })

//     .populate(
//       "services",

//       "name description price image",
//     )

//     .sort({
//       createdAt: -1,
//     });

//   return packages;
// };

// // Get single package

// const getPackageById = async (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(400, "Invalid package ID");
//   }

//   const servicePackage = await ServicePackage.findById(id)

//     .populate(
//       "services",

//       "name description price image",
//     );

//   if (!servicePackage) {
//     throw new ApiError(404, "Package not found");
//   }

//   return servicePackage;
// };

// // Update package

// const updatePackage = async (id, updateData) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(400, "Invalid package ID");
//   }

//   if (updateData.name) {
//     updateData.slug = slugify(updateData.name, {
//       lower: true,
//       strict: true,
//     });
//   }

//   if (updateData.services) {
//     const servicesExist = await Service.find({
//       _id: {
//         $in: updateData.services,
//       },

//       isActive: true,
//     });

//     if (servicesExist.length !== updateData.services.length) {
//       throw new ApiError(400, "One or more services are invalid");
//     }
//   }

//   const servicePackage = await ServicePackage.findByIdAndUpdate(
//     id,

//     updateData,

//     {
//       new: true,

//       runValidators: true,
//     },
//   );

//   if (!servicePackage) {
//     throw new ApiError(404, "Package not found");
//   }

//   return servicePackage;
// };

// // Delete package

// const deletePackage = async (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(400, "Invalid package ID");
//   }

//   const servicePackage = await ServicePackage.findByIdAndDelete(id);

//   if (!servicePackage) {
//     throw new ApiError(404, "Package not found");
//   }

//   return servicePackage;
// };

// module.exports = {
//   createPackage,

//   getPackages,

//   getPackageById,

//   updatePackage,

//   deletePackage,
// };


const ServicePackage = require("./packageModel");
const Service = require("../services/serviceModel");
const ApiError = require("../utils/ApiError");
const slugify = require("slugify");
const mongoose = require("mongoose");

// Create package
const createPackage = async (packageData, userId) => {
  const slug = slugify(packageData.name, {
    lower: true,
    strict: true,
  });

  const existingPackage = await ServicePackage.findOne({ slug });
  if (existingPackage) {
    throw new ApiError(400, "Package already exists");
  }

  const servicesExist = await Service.find({
    _id: { $in: packageData.services },
    isActive: true,
  });

  if (servicesExist.length !== packageData.services.length) {
    throw new ApiError(400, "One or more services are invalid");
  }

  const servicePackage = await ServicePackage.create({
    ...packageData,
    slug,
    createdBy: userId,
  });

  return servicePackage;
};

// Get packages (public - active only)
const getPackages = async () => {
  const packages = await ServicePackage.find({
    isActive: true,
  })
    .populate("services", "name description price image")
    .sort({ createdAt: -1 });
  return packages;
};

// ✅ Get all packages (admin - includes inactive)
const getAdminAllPackagesService = async () => {
  const packages = await ServicePackage.find()
    .populate("services", "name description price image")
    .populate("createdBy", "firstName lastName email")
    .sort({ createdAt: -1 });
  return packages;
};

// Get single package
const getPackageById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid package ID");
  }
  const servicePackage = await ServicePackage.findById(id)
    .populate("services", "name description price image");
  if (!servicePackage) {
    throw new ApiError(404, "Package not found");
  }
  return servicePackage;
};

// Update package
const updatePackage = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid package ID");
  }

  if (updateData.name) {
    updateData.slug = slugify(updateData.name, {
      lower: true,
      strict: true,
    });
  }

  if (updateData.services) {
    const servicesExist = await Service.find({
      _id: { $in: updateData.services },
      isActive: true,
    });
    if (servicesExist.length !== updateData.services.length) {
      throw new ApiError(400, "One or more services are invalid");
    }
  }

  const servicePackage = await ServicePackage.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!servicePackage) {
    throw new ApiError(404, "Package not found");
  }
  return servicePackage;
};

// Delete package
const deletePackage = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid package ID");
  }
  const servicePackage = await ServicePackage.findByIdAndDelete(id);
  if (!servicePackage) {
    throw new ApiError(404, "Package not found");
  }
  return servicePackage;
};

module.exports = {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  getAdminAllPackagesService, 
};