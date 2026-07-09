const Media = require("./mediaModel");

const ApiError = require("../utils/ApiError");

// Save uploaded file information
const createMedia = async (
  userId,

  mediaData,
) => {
  const media = await Media.create({
    uploadedBy: userId,

    ...mediaData,
  });

  return media;
};

// Get user's uploaded media
const getMyMedia = async (userId) => {
  const media = await Media.find({
    uploadedBy: userId,
  });

  return media;
};

// Get single media
const getMediaById = async (mediaId) => {
  const media = await Media.findById(mediaId);

  if (!media) {
    throw new ApiError(
      404,

      "Media not found",
    );
  }

  return media;
};

// Delete media record
const deleteMedia = async (mediaId) => {
  const media = await Media.findByIdAndDelete(mediaId);

  if (!media) {
    throw new ApiError(
      404,

      "Media not found",
    );
  }

  return media;
};

module.exports = {
  createMedia,

  getMyMedia,

  getMediaById,

  deleteMedia,
};
