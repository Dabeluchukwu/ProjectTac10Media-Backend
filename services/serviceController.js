// const asyncHandler = require("../utils/asyncHandler");

// const ApiResponse = require("../utils/ApiResponse");

// const {
//   createService,
//   getServices,
//   getServiceById,
//   updateService,
//   deleteService,
// } = require("./serviceService");

// const {
//   createServiceValidation,
//   updateServiceValidation,
// } = require("./serviceValidation");

// // Create production service

// const createProductionService = asyncHandler(async (req, res) => {
//   const { error } = createServiceValidation.validate(req.body);

//   if (error) {
//     throw new Error(error.details[0].message);
//   }

//   const service = await createService(
//     req.body,

//     req.user.id,
//   );

//   res.status(201).json(
//     new ApiResponse(
//       201,

//       "Service created successfully",

//       service,
//     ),
//   );
// });

// // Get all services

// const getAllServices = asyncHandler(async (req, res) => {
//   const services = await getServices();

//   res.status(200).json(
//     new ApiResponse(
//       200,

//       "Services fetched successfully",

//       services,
//     ),
//   );
// });

// // Get single service

// const getSingleService = asyncHandler(async (req, res) => {
//   const service = await getServiceById(req.params.id);

//   res.status(200).json(
//     new ApiResponse(
//       200,

//       "Service fetched successfully",

//       service,
//     ),
//   );
// });

// // Update service

// const updateProductionService = asyncHandler(async (req, res) => {
//   const { error } = updateServiceValidation.validate(req.body);

//   if (error) {
//     throw new Error(error.details[0].message);
//   }

//   const service = await updateService(
//     req.params.id,

//     req.body,
//   );

//   res.status(200).json(
//     new ApiResponse(
//       200,

//       "Service updated successfully",

//       service,
//     ),
//   );
// });

// // Delete service

// const removeProductionService = asyncHandler(async (req, res) => {
//   await deleteService(req.params.id);

//   res.status(200).json(
//     new ApiResponse(
//       200,

//       "Service deleted successfully",

//       null,
//     ),
//   );
// });

// module.exports = {
//   createProductionService,

//   getAllServices,

//   getSingleService,

//   updateProductionService,

//   removeProductionService,
// };


const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getAdminAllServicesService, // ✅ Add this
} = require("./serviceService");
const {
  createServiceValidation,
  updateServiceValidation,
} = require("./serviceValidation");

// Create production service
const createProductionService = asyncHandler(async (req, res) => {
  const { error } = createServiceValidation.validate(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const service = await createService(req.body, req.user.id);
  res.status(201).json(
    new ApiResponse(201, "Service created successfully", service)
  );
});

// Get all services (public - active only)
const getAllServices = asyncHandler(async (req, res) => {
  const services = await getServices();
  res.status(200).json(
    new ApiResponse(200, "Services fetched successfully", services)
  );
});

// ✅ Get all services (admin - includes inactive)
const getAdminAllServices = asyncHandler(async (req, res) => {
  const services = await getAdminAllServicesService();
  res.status(200).json(
    new ApiResponse(200, "All services fetched successfully", services)
  );
});

// Get single service
const getSingleService = asyncHandler(async (req, res) => {
  const service = await getServiceById(req.params.id);
  res.status(200).json(
    new ApiResponse(200, "Service fetched successfully", service)
  );
});

// Update service
const updateProductionService = asyncHandler(async (req, res) => {
  const { error } = updateServiceValidation.validate(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const service = await updateService(req.params.id, req.body);
  res.status(200).json(
    new ApiResponse(200, "Service updated successfully", service)
  );
});

// Delete service
const removeProductionService = asyncHandler(async (req, res) => {
  await deleteService(req.params.id);
  res.status(200).json(
    new ApiResponse(200, "Service deleted successfully", null)
  );
});

module.exports = {
  createProductionService,
  getAllServices,
  getSingleService,
  updateProductionService,
  removeProductionService,
  getAdminAllServices, 
};