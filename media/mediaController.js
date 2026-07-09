// Handles async errors automatically
const asyncHandler = require("../utils/asyncHandler");

// Standard API response format
const ApiResponse = require("../utils/ApiResponse");

// Import media service methods
const {
  createMedia,

  getMyMedia,

  getMediaById,

  deleteMedia,
} = require("./mediaService");

// Save uploaded media information
const create = asyncHandler(async (req, res) => {
  // req.user comes from authentication middleware
  // req.file will come from upload middleware later
  const media = await createMedia(
    req.user.id,

    req.body,
  );

  res.status(201).json(
    new ApiResponse(
      201,

      "Media uploaded successfully",

      media,
    ),
  );
});

// Get logged-in user's media
const getMine = asyncHandler(async (req, res) => {
  const media = await getMyMedia(req.user.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Media fetched successfully",

      media,
    ),
  );
});

// Get single media
const getSingle = asyncHandler(async (req, res) => {
  const media = await getMediaById(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Media fetched successfully",

      media,
    ),
  );
});

// Delete media
const remove = asyncHandler(async (req, res) => {
  await deleteMedia(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Media deleted successfully",
    ),
  );
});

module.exports = {
  create,

  getMine,

  getSingle,

  remove,
};
