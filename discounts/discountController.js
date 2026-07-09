// Handles async errors automatically
const asyncHandler = require("../utils/asyncHandler");

// Standard API response format
const ApiResponse = require("../utils/ApiResponse");

// Import discount service functions
const {
  createDiscount,

  applyDiscount,

  getDiscounts,

  getDiscountById,

  updateDiscount,

  deleteDiscount,
} = require("./discountService");

// Create discount code
const create = asyncHandler(async (req, res) => {
  const discount = await createDiscount(
    req.user.id,

    req.body,
  );

  res.status(201).json(
    new ApiResponse(
      201,

      "Discount created successfully",

      discount,
    ),
  );
});

// Apply discount code
const apply = asyncHandler(async (req, res) => {
  const result = await applyDiscount(
    req.body.code,

    req.body.amount,
  );

  res.status(200).json(
    new ApiResponse(
      200,

      "Discount applied successfully",

      result,
    ),
  );
});

// Get all discounts
const getAll = asyncHandler(async (req, res) => {
  const discounts = await getDiscounts();

  res.status(200).json(
    new ApiResponse(
      200,

      "Discounts fetched successfully",

      discounts,
    ),
  );
});

// Get single discount
const getSingle = asyncHandler(async (req, res) => {
  const discount = await getDiscountById(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Discount fetched successfully",

      discount,
    ),
  );
});

// Update discount
const update = asyncHandler(async (req, res) => {
  const discount = await updateDiscount(
    req.params.id,

    req.body,
  );

  res.status(200).json(
    new ApiResponse(
      200,

      "Discount updated successfully",

      discount,
    ),
  );
});

// Delete discount
const remove = asyncHandler(async (req, res) => {
  await deleteDiscount(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Discount deleted successfully",
    ),
  );
});

module.exports = {
  create,

  apply,

  getAll,

  getSingle,

  update,

  remove,
};
