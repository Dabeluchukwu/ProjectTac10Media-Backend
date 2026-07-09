// Handles async controller errors automatically
const asyncHandler = require("../utils/asyncHandler");

// Standard API response structure
const ApiResponse = require("../utils/ApiResponse");

// Import advert service methods
const {
  createAdvert,
  getAdverts,
  getAdvertById,
  updateAdvert,
  deleteAdvert,
} = require("./advertService");

/**
 * Create advertisement
 */
const create = asyncHandler(async (req, res) => {
  const advert = await createAdvert(req.user.id, req.body);

  res
    .status(201)
    .json(new ApiResponse(201, "Advertisement created successfully", advert));
});

/**
 * Get all active advertisements
 */
const getAll = asyncHandler(async (req, res) => {
  const adverts = await getAdverts();

  res
    .status(200)
    .json(new ApiResponse(200, "Advertisements fetched successfully", adverts));
});

/**
 * Get single advertisement
 */
const getSingle = asyncHandler(async (req, res) => {
  const advert = await getAdvertById(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, "Advertisement fetched successfully", advert));
});

/**
 * Update advertisement
 */
const update = asyncHandler(async (req, res) => {
  const advert = await updateAdvert(req.params.id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, "Advertisement updated successfully", advert));
});

/**
 * Delete advertisement
 */
const remove = asyncHandler(async (req, res) => {
  await deleteAdvert(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, "Advertisement deleted successfully"));
});

module.exports = {
  create,
  getAll,
  getSingle,
  update,
  remove,
};
