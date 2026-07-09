const Content = require("./contentModel");

const ApiError = require("../utils/ApiError");

// Get page content
const getContentByPage = async (page) => {
  const content = await Content.findOne({
    page: page.toLowerCase(),
  });

  if (!content) {
    throw new ApiError(
      404,

      "Content not found",
    );
  }

  return content;
};

// Create new page content
const createContent = async (
  contentData,

  userId,
) => {
  const existingContent = await Content.findOne({
    page: contentData.page.toLowerCase(),
  });

  if (existingContent) {
    throw new ApiError(
      400,

      "Content for this page already exists",
    );
  }

  const content = await Content.create({
    page: contentData.page.toLowerCase(),

    sections: contentData.sections || {},

    meta: contentData.meta || {},

    updatedBy: userId,

    isPublished: contentData.isPublished || false,
  });

  return content;
};

// Update existing page content
const updateContent = async (
  page,

  updateData,

  userId,
) => {
  const content = await Content.findOne({
    page: page.toLowerCase(),
  });

  if (!content) {
    throw new ApiError(
      404,

      "Content not found",
    );
  }

  // Update sections if provided
  if (updateData.sections) {
    content.sections = {
      ...content.sections,

      ...updateData.sections,
    };
  }

  // Update SEO metadata
  if (updateData.meta) {
    content.meta = {
      ...content.meta,

      ...updateData.meta,
    };
  }

  // Update publish status
  if (typeof updateData.isPublished !== "undefined") {
    content.isPublished = updateData.isPublished;
  }

  // Track admin who updated
  content.updatedBy = userId;

  await content.save();

  return content;
};

// Delete page content
const deleteContent = async (page) => {
  const content = await Content.findOneAndDelete({
    page: page.toLowerCase(),
  });

  if (!content) {
    throw new ApiError(
      404,

      "Content not found",
    );
  }

  return content;
};

module.exports = {
  getContentByPage,

  createContent,

  updateContent,

  deleteContent,
};
