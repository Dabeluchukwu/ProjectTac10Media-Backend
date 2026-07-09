const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const {
  createBundle,
  getBundles,
  getBundleById,
  updateBundle,
  deleteBundle,
} = require("./bundleService");

const {
  createBundleValidation,
  updateBundleValidation,
} = require("./bundleValidation");

// Create course bundle

const createCourseBundle = asyncHandler(async (req, res) => {
  const { error } = createBundleValidation.validate(req.body);

  if (error) {
    throw new Error(error.details[0].message);
  }

  const bundle = await createBundle(
    req.body,

    req.user.id,
  );

  res.status(201).json(
    new ApiResponse(
      201,

      "Course bundle created successfully",

      bundle,
    ),
  );
});

// Get all course bundles

const getAllCourseBundles = asyncHandler(async (req, res) => {
  const bundles = await getBundles();

  res.status(200).json(
    new ApiResponse(
      200,

      "Course bundles fetched successfully",

      bundles,
    ),
  );
});

// Get single course bundle

const getSingleCourseBundle = asyncHandler(async (req, res) => {
  const bundle = await getBundleById(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Course bundle fetched successfully",

      bundle,
    ),
  );
});

// Update course bundle

const updateCourseBundle = asyncHandler(async (req, res) => {
  const { error } = updateBundleValidation.validate(req.body);

  if (error) {
    throw new Error(error.details[0].message);
  }

  const bundle = await updateBundle(
    req.params.id,

    req.body,
  );

  res.status(200).json(
    new ApiResponse(
      200,

      "Course bundle updated successfully",

      bundle,
    ),
  );
});

// Delete course bundle

const removeCourseBundle = asyncHandler(async (req, res) => {
  await deleteBundle(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Course bundle deleted successfully",

      null,
    ),
  );
});

module.exports = {
  createCourseBundle,

  getAllCourseBundles,

  getSingleCourseBundle,

  updateCourseBundle,

  removeCourseBundle,
};
