const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const {
  getAdminStats,
  getAdminAnalytics,
  getRevenueChart,
  getEnrollmentChart,
  getBookingChart,
  getInstructorStats,
  getInstructorAnalytics,
  getPlatformStats,
  getUserGrowthChart,
  getPlatformAnalytics,
} = require("./dashboardService");

// Get admin dashboard stats
const getAdminStatsHandler = asyncHandler(async (req, res) => {
  console.log("📊 Admin stats request received");
  const stats = await getAdminStats();
  console.log("📊 Sending admin stats response");
  res.status(200).json(
    new ApiResponse(200, "Admin stats fetched successfully", stats)
  );
});

// Get admin analytics
const getAdminAnalyticsHandler = asyncHandler(async (req, res) => {
  const { period = "month" } = req.query;
  const analytics = await getAdminAnalytics(period);
  res.status(200).json(
    new ApiResponse(200, "Admin analytics fetched successfully", analytics)
  );
});

// Get instructor dashboard stats
const getInstructorStatsHandler = asyncHandler(async (req, res) => {
  console.log("📊 Instructor stats request received for user:", req.user.id);
  const stats = await getInstructorStats(req.user.id);
  console.log("📊 Sending instructor stats response");
  res.status(200).json(
    new ApiResponse(200, "Instructor stats fetched successfully", stats)
  );
});

// Get instructor analytics
const getInstructorAnalyticsHandler = asyncHandler(async (req, res) => {
  const { period = "month" } = req.query;
  const analytics = await getInstructorAnalytics(req.user.id, period);
  res.status(200).json(
    new ApiResponse(200, "Instructor analytics fetched successfully", analytics)
  );
});

// Platform Stats (Super Admin)
const getPlatformStatsHandler = asyncHandler(async (req, res) => {
  console.log("📊 Platform stats request received");
  const stats = await getPlatformStats();
  console.log("📊 Sending platform stats response");
  res.status(200).json(
    new ApiResponse(200, "Platform stats fetched successfully", stats)
  );
});

// Get revenue chart data
const getRevenueChartData = asyncHandler(async (req, res) => {
  const { period = "month" } = req.query;
  const data = await getRevenueChart(period);
  res.status(200).json(
    new ApiResponse(200, "Revenue chart data fetched successfully", data)
  );
});

// Get enrollment chart data
const getEnrollmentChartData = asyncHandler(async (req, res) => {
  const { period = "month" } = req.query;
  const data = await getEnrollmentChart(period);
  res.status(200).json(
    new ApiResponse(200, "Enrollment chart data fetched successfully", data)
  );
});

// Get booking chart data
const getBookingChartData = asyncHandler(async (req, res) => {
  const { period = "month" } = req.query;
  console.log(`📊 Booking chart request received for period: ${period}`);
  try {
    const data = await getBookingChart(period);
    console.log(`📊 Booking chart data: ${data?.length || 0} entries`);
    res.status(200).json(
      new ApiResponse(200, "Booking chart data fetched successfully", data)
    );
  } catch (error) {
    console.error("❌ Booking chart error:", error);
    throw error;
  }
});

// ✅ Get user growth chart data
const getUserGrowthChartData = asyncHandler(async (req, res) => {
  const { period = "month" } = req.query;
  console.log(`📊 User growth chart request received for period: ${period}`);
  const data = await getUserGrowthChart(period);
  console.log(`📊 User growth chart data: ${data?.length || 0} entries`);
  res.status(200).json(
    new ApiResponse(200, "User growth chart data fetched successfully", data)
  );
});


// Platform Analytics (Super Admin)
const getPlatformAnalyticsHandler = asyncHandler(async (req, res) => {
  const { period = "month" } = req.query;
  console.log(`📊 Platform analytics request received for period: ${period}`);
  const analytics = await getPlatformAnalytics(period);
  res.status(200).json(
    new ApiResponse(200, "Platform analytics fetched successfully", analytics)
  );
});


module.exports = {
  getAdminStats: getAdminStatsHandler,
  getAdminAnalytics: getAdminAnalyticsHandler,
  getInstructorStats: getInstructorStatsHandler,
  getInstructorAnalytics: getInstructorAnalyticsHandler,
  getPlatformStats: getPlatformStatsHandler,
    getPlatformAnalytics: getPlatformAnalyticsHandler,
  getRevenueChartData,
  getEnrollmentChartData,
  getBookingChartData,
  getUserGrowthChartData,
  
};