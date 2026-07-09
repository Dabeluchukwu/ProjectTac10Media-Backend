// Import advert model
const Advert = require("./advertModel");

// Import custom error handler
const ApiError = require("../utils/ApiError");

// Create a new advertisement
const createAdvert = async (
  userId,

  advertData,
) => {
  // Attach creator of advert
  const advert = await Advert.create({
    createdBy: userId,

    ...advertData,
  });

  return advert;
};

// Get all active advertisements
const getAdverts = async () => {
  const adverts = await Advert.find({
    status: "active",
  })

    .populate(
      "createdBy",

      "firstName lastName email",
    );

  return adverts;
};

// Get single advertisement
const getAdvertById = async (advertId) => {
  const advert = await Advert.findById(advertId)

    .populate(
      "createdBy",

      "firstName lastName email",
    );

  if (!advert) {
    throw new ApiError(
      404,

      "Advertisement not found",
    );
  }

  return advert;
};

// Update advertisement
const updateAdvert = async (
  advertId,

  updateData,
) => {
  const advert = await Advert.findByIdAndUpdate(
    advertId,

    updateData,

    {
      new: true,

      runValidators: true,
    },
  );

  if (!advert) {
    throw new ApiError(
      404,

      "Advertisement not found",
    );
  }

  return advert;
};

// Delete advertisement
const deleteAdvert = async (advertId) => {
  const advert = await Advert.findByIdAndDelete(advertId);

  if (!advert) {
    throw new ApiError(
      404,

      "Advertisement not found",
    );
  }

  return advert;
};

module.exports = {
  createAdvert,

  getAdverts,

  getAdvertById,

  updateAdvert,

  deleteAdvert,
};
