// const asyncHandler = require("../utils/asyncHandler");

// const ApiResponse = require("../utils/ApiResponse");

// const {
//   createPackage,
//   getPackages,
//   getPackageById,
//   updatePackage,
//   deletePackage,
// } = require("./packageService");

// const {
//   createPackageValidation,
//   updatePackageValidation,
// } = require("./packageValidation");

// // Create service package

// const createServicePackage = asyncHandler(async (req, res) => {
//   const { error } = createPackageValidation.validate(req.body);

//   if (error) {
//     throw new Error(error.details[0].message);
//   }

//   const servicePackage = await createPackage(
//     req.body,

//     req.user.id,
//   );

//   res.status(201).json(
//     new ApiResponse(
//       201,

//       "Package created successfully",

//       servicePackage,
//     ),
//   );
// });

// // Get all packages

// const getAllPackages = asyncHandler(async (req, res) => {
//   const packages = await getPackages();

//   res.status(200).json(
//     new ApiResponse(
//       200,

//       "Packages fetched successfully",

//       packages,
//     ),
//   );
// });

// // Get single package

// const getSinglePackage = asyncHandler(async (req, res) => {
//   const servicePackage = await getPackageById(req.params.id);

//   res.status(200).json(
//     new ApiResponse(
//       200,

//       "Package fetched successfully",

//       servicePackage,
//     ),
//   );
// });

// // Update package

// const updateServicePackage = asyncHandler(async (req, res) => {
//   const { error } = updatePackageValidation.validate(req.body);

//   if (error) {
//     throw new Error(error.details[0].message);
//   }

//   const servicePackage = await updatePackage(
//     req.params.id,

//     req.body,
//   );

//   res.status(200).json(
//     new ApiResponse(
//       200,

//       "Package updated successfully",

//       servicePackage,
//     ),
//   );
// });

// // Delete package

// const removeServicePackage = asyncHandler(async (req, res) => {
//   await deletePackage(req.params.id);

//   res.status(200).json(
//     new ApiResponse(
//       200,

//       "Package deleted successfully",

//       null,
//     ),
//   );
// });

// module.exports = {
//   createServicePackage,

//   getAllPackages,

//   getSinglePackage,

//   updateServicePackage,

//   removeServicePackage,
// };


const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  getAdminAllPackagesService, 
} = require("./packageService");
const {
  createPackageValidation,
  updatePackageValidation,
} = require("./packageValidation");

// Create service package
const createServicePackage = asyncHandler(async (req, res) => {
  const { error } = createPackageValidation.validate(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const servicePackage = await createPackage(req.body, req.user.id);
  res.status(201).json(
    new ApiResponse(201, "Package created successfully", servicePackage)
  );
});

// Get all packages (public - active only)
const getAllPackages = asyncHandler(async (req, res) => {
  const packages = await getPackages();
  res.status(200).json(
    new ApiResponse(200, "Packages fetched successfully", packages)
  );
});

// ✅ Get all packages (admin - includes inactive)
const getAdminAllPackages = asyncHandler(async (req, res) => {
  const packages = await getAdminAllPackagesService();
  res.status(200).json(
    new ApiResponse(200, "All packages fetched successfully", packages)
  );
});

// Get single package
const getSinglePackage = asyncHandler(async (req, res) => {
  const servicePackage = await getPackageById(req.params.id);
  res.status(200).json(
    new ApiResponse(200, "Package fetched successfully", servicePackage)
  );
});

// Update package
const updateServicePackage = asyncHandler(async (req, res) => {
  const { error } = updatePackageValidation.validate(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const servicePackage = await updatePackage(req.params.id, req.body);
  res.status(200).json(
    new ApiResponse(200, "Package updated successfully", servicePackage)
  );
});

// Delete package
const removeServicePackage = asyncHandler(async (req, res) => {
  await deletePackage(req.params.id);
  res.status(200).json(
    new ApiResponse(200, "Package deleted successfully", null)
  );
});

module.exports = {
  createServicePackage,
  getAllPackages,
  getSinglePackage,
  updateServicePackage,
  removeServicePackage,
  getAdminAllPackages, 
};