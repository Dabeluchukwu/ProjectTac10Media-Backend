const CourseBundle = require("./bundleModel");

const Course = require("../courses/courseModel");

const ApiError = require("../utils/ApiError");

const mongoose = require("mongoose");

// Create course bundle

const createBundle = async (
  bundleData,

  userId,
) => {
  const existingBundle = await CourseBundle.findOne({
    slug: bundleData.slug,
  });

  if (existingBundle) {
    throw new ApiError(
      400,

      "Bundle already exists",
    );
  }

  const coursesExist = await Course.find({
    _id: {
      $in: bundleData.courses,
    },
  });

  if (coursesExist.length !== bundleData.courses.length) {
    throw new ApiError(
      400,

      "One or more courses are invalid",
    );
  }

  const bundle = await CourseBundle.create({
    ...bundleData,

    createdBy: userId,
  });

  return bundle;
};

// Get all bundles

const getBundles = async () => {
  const bundles = await CourseBundle.find()

    .populate(
      "courses",

      "title description price image",
    )

    .sort({
      createdAt: -1,
    });

  return bundles;
};

// Get single bundle

const getBundleById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(
      400,

      "Invalid bundle ID",
    );
  }

  const bundle = await CourseBundle.findById(id)

    .populate(
      "courses",

      "title description price image",
    );

  if (!bundle) {
    throw new ApiError(
      404,

      "Bundle not found",
    );
  }

  return bundle;
};

// Update bundle

const updateBundle = async (
  id,

  updateData,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(
      400,

      "Invalid bundle ID",
    );
  }

  if (updateData.courses) {
    const coursesExist = await Course.find({
      _id: {
        $in: updateData.courses,
      },
    });

    if (coursesExist.length !== updateData.courses.length) {
      throw new ApiError(
        400,

        "One or more courses are invalid",
      );
    }
  }

  const bundle = await CourseBundle.findByIdAndUpdate(
    id,

    updateData,

    {
      new: true,

      runValidators: true,
    },
  );

  if (!bundle) {
    throw new ApiError(
      404,

      "Bundle not found",
    );
  }

  return bundle;
};

// Delete bundle

const deleteBundle = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(
      400,

      "Invalid bundle ID",
    );
  }

  const bundle = await CourseBundle.findByIdAndDelete(id);

  if (!bundle) {
    throw new ApiError(
      404,

      "Bundle not found",
    );
  }

  return bundle;
};

module.exports = {
  createBundle,

  getBundles,

  getBundleById,

  updateBundle,

  deleteBundle,
};
