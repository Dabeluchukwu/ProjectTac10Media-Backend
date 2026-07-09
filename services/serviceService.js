// const Service = require("./serviceModel");

// const ApiError = require("../utils/ApiError");

// const slugify = require("slugify");

// const mongoose = require("mongoose");

// // Create production service

// const createService = async (
//   serviceData,

//   userId,
// ) => {
//   const generatedSlug = slugify(
//     serviceData.name,

//     {
//       lower: true,

//       strict: true,
//     },
//   );

//   const existingService = await Service.findOne({
//     slug: generatedSlug,
//   });

//   if (existingService) {
//     throw new ApiError(
//       400,

//       "Service already exists",
//     );
//   }

//   const service = await Service.create({
//     ...serviceData,

//     slug: generatedSlug,

//     currency: serviceData.currency || "NGN",

//     createdBy: userId,
//   });

//   return service;
// };

// // Get all active services (Public)

// const getServices = async () => {
//   const services = await Service.find({
//     isActive: true,
//   })

//     .populate(
//       "createdBy",

//       "firstName lastName email",
//     )

//     .sort({
//       createdAt: -1,
//     });

//   return services;
// };

// // Get single service

// const getServiceById = async (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(
//       400,

//       "Invalid service ID",
//     );
//   }

//   const service = await Service.findById(id);

//   if (!service) {
//     throw new ApiError(
//       404,

//       "Service not found",
//     );
//   }

//   return service;
// };

// // Update service

// const updateService = async (
//   id,

//   updateData,
// ) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(
//       400,

//       "Invalid service ID",
//     );
//   }

//   const existingService = await Service.findById(id);

//   if (!existingService) {
//     throw new ApiError(
//       404,

//       "Service not found",
//     );
//   }

//   // Regenerate slug if name changes

//   if (updateData.name) {
//     updateData.slug = slugify(
//       updateData.name,

//       {
//         lower: true,

//         strict: true,
//       },
//     );
//   }

//   // Prevent duplicate slug

//   if (updateData.slug) {
//     const duplicate = await Service.findOne({
//       slug: updateData.slug,

//       _id: {
//         $ne: id,
//       },
//     });

//     if (duplicate) {
//       throw new ApiError(
//         400,

//         "Service already exists",
//       );
//     }
//   }

//   const service = await Service.findByIdAndUpdate(
//     id,

//     updateData,

//     {
//       new: true,

//       runValidators: true,
//     },
//   );

//   return service;
// };

// // Soft delete service

// const deleteService = async (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(
//       400,

//       "Invalid service ID",
//     );
//   }

//   const service = await Service.findByIdAndUpdate(
//     id,

//     {
//       isActive: false,
//     },

//     {
//       new: true,
//     },
//   );

//   if (!service) {
//     throw new ApiError(
//       404,

//       "Service not found",
//     );
//   }

//   return service;
// };

// module.exports = {
//   createService,

//   getServices,

//   getServiceById,

//   updateService,

//   deleteService,
// };


const Service = require("./serviceModel");
const ApiError = require("../utils/ApiError");
const slugify = require("slugify");
const mongoose = require("mongoose");

// Create production service
const createService = async (serviceData, userId) => {
  const generatedSlug = slugify(serviceData.name, {
    lower: true,
    strict: true,
  });

  const existingService = await Service.findOne({ slug: generatedSlug });
  if (existingService) {
    throw new ApiError(400, "Service already exists");
  }

  const service = await Service.create({
    ...serviceData,
    slug: generatedSlug,
    currency: serviceData.currency || "NGN",
    createdBy: userId,
  });

  return service;
};

// Get all active services (Public)
const getServices = async () => {
  const services = await Service.find({ isActive: true })
    .populate("createdBy", "firstName lastName email")
    .sort({ createdAt: -1 });
  return services;
};

// ✅ Get all services (admin - includes inactive)
const getAdminAllServicesService = async () => {
  const services = await Service.find()
    .populate("createdBy", "firstName lastName email")
    .sort({ createdAt: -1 });
  return services;
};

// Get single service
const getServiceById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid service ID");
  }
  const service = await Service.findById(id);
  if (!service) {
    throw new ApiError(404, "Service not found");
  }
  return service;
};

// Update service
const updateService = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid service ID");
  }

  const existingService = await Service.findById(id);
  if (!existingService) {
    throw new ApiError(404, "Service not found");
  }

  if (updateData.name) {
    updateData.slug = slugify(updateData.name, {
      lower: true,
      strict: true,
    });
  }

  if (updateData.slug) {
    const duplicate = await Service.findOne({
      slug: updateData.slug,
      _id: { $ne: id },
    });
    if (duplicate) {
      throw new ApiError(400, "Service already exists");
    }
  }

  const service = await Service.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
  return service;
};

// Soft delete service
const deleteService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid service ID");
  }
  const service = await Service.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!service) {
    throw new ApiError(404, "Service not found");
  }
  return service;
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getAdminAllServicesService, 
};