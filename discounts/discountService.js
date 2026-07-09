// Import discount model
const Discount = require("./discountModel");

// Import custom error handler
const ApiError = require("../utils/ApiError");

// Create a discount code
const createDiscount = async (
  userId,

  discountData,
) => {
  // Check if code already exists
  const existingDiscount = await Discount.findOne({
    code: discountData.code.toUpperCase(),
  });

  if (existingDiscount) {
    throw new ApiError(
      400,

      "Discount code already exists",
    );
  }

  // Create discount
  const discount = await Discount.create({
    createdBy: userId,

    ...discountData,
  });

  return discount;
};

// Validate discount code
const validateDiscount = async (code) => {
  const discount = await Discount.findOne({
    code: code.toUpperCase(),

    status: "active",
  });

  if (!discount) {
    throw new ApiError(
      404,

      "Invalid discount code",
    );
  }

  // Check expiry
  if (new Date() > discount.expiresAt) {
    throw new ApiError(
      400,

      "Discount code expired",
    );
  }

  // Check usage limit
  if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
    throw new ApiError(
      400,

      "Discount usage limit reached",
    );
  }

  return discount;
};

// Calculate discount amount
const applyDiscount = async (
  code,

  amount,
) => {
  const discount = await validateDiscount(code);

  let discountAmount;

  // Percentage discount
  if (discount.type === "percentage") {
    discountAmount = (amount * discount.value) / 100;
  }

  // Fixed amount discount
  else {
    discountAmount = discount.value;
  }

  // Increase usage count
  discount.usedCount += 1;

  await discount.save();

  return {
    originalAmount: amount,

    discountAmount,

    finalAmount: amount - discountAmount,
  };
};

// Get all discounts
const getDiscounts = async () => {
  const discounts = await Discount.find();

  return discounts;
};

// Get single discount
const getDiscountById = async (id) => {
  const discount = await Discount.findById(id);

  if (!discount) {
    throw new ApiError(
      404,

      "Discount not found",
    );
  }

  return discount;
};

// Update discount
const updateDiscount = async (
  id,

  updateData,
) => {
  const discount = await Discount.findByIdAndUpdate(
    id,

    updateData,

    {
      new: true,

      runValidators: true,
    },
  );

  if (!discount) {
    throw new ApiError(
      404,

      "Discount not found",
    );
  }

  return discount;
};

// Delete discount
const deleteDiscount = async (id) => {
  const discount = await Discount.findByIdAndDelete(id);

  if (!discount) {
    throw new ApiError(
      404,

      "Discount not found",
    );
  }

  return discount;
};

module.exports = {
  createDiscount,

  validateDiscount,

  applyDiscount,

  getDiscounts,

  getDiscountById,

  updateDiscount,

  deleteDiscount,
};
