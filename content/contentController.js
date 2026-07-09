const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const {
  getContentByPage,

  createContent,

  updateContent,

  deleteContent,
} = require("./contentService");

const {
  createContentValidation,

  updateContentValidation,
} = require("./contentValidation");

// Get content by page
// Example:
// GET /api/v1/content/home
const getPageContent = asyncHandler(async (req, res) => {
  const content = await getContentByPage(req.params.page);

  res.status(200).json(
    new ApiResponse(
      200,

      "Content fetched successfully",

      content,
    ),
  );
});

// Create new page content
// Admin creates:
// home
// about
// courses
const createPageContent = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = createContentValidation.validate(req.body);

  if (error) {
    throw new Error(error.details[0].message);
  }

  const content = await createContent(
    req.body,

    req.user.id,
  );

  res.status(201).json(
    new ApiResponse(
      201,

      "Content created successfully",

      content,
    ),
  );
});

// Update existing page content
// Example:
// PATCH /content/home
const updatePageContent = asyncHandler(async (req, res) => {
  // Validate update data
  const { error } = updateContentValidation.validate(req.body);

  if (error) {
    throw new Error(error.details[0].message);
  }

  const content = await updateContent(
    req.params.page,

    req.body,

    req.user.id,
  );

  res.status(200).json(
    new ApiResponse(
      200,

      "Content updated successfully",

      content,
    ),
  );
});

// Delete page content
const removePageContent = asyncHandler(async (req, res) => {
  await deleteContent(req.params.page);

  res.status(200).json(
    new ApiResponse(
      200,

      "Content deleted successfully",

      null,
    ),
  );
});

module.exports = {
  getPageContent,

  createPageContent,

  updatePageContent,

  removePageContent,
};
