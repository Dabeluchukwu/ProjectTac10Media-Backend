const User = require("../users/userModel");
const Course = require("../courses/courseModel");
const Booking = require("../bookings/bookingModel");
const Registration = require("../courseRegistration/registrationModel");
const Payment = require("../payments/paymentModel");
const ApiError = require("../utils/ApiError");

// ============================================
// Admin Stats
// ============================================

// Get admin dashboard stats
const getAdminStats = async () => {
  try {
    console.log("🔍 Fetching admin dashboard stats...");

    const [
      totalUsers,
      totalCourses,
      totalBookings,
      totalRegistrations,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments({ isPublished: true }),
      Booking.countDocuments(),
      Registration.countDocuments({ paymentStatus: "paid", status: "approved" }),
    ]);

    console.log(`📊 Stats: Users=${totalUsers}, Courses=${totalCourses}, Bookings=${totalBookings}`);

    // Get revenue
    const revenueResult = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    console.log(`💰 Total Revenue: ${totalRevenue}`);

    // Get recent activities
    const recentActivities = [];

    // Recent registrations (enrollments)
    const recentRegistrations = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("student", "firstName lastName email")
      .populate("course", "title");

    recentRegistrations.forEach((reg) => {
      const studentName = reg.student?.firstName && reg.student?.lastName 
        ? `${reg.student.firstName} ${reg.student.lastName}` 
        : reg.student?.email || "A user";
      recentActivities.push({
        type: "enrollment",
        message: `${studentName} enrolled in "${reg.course?.title || "a course"}"`,
        createdAt: reg.createdAt,
      });
    });

    // Recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "firstName lastName email");

    recentBookings.forEach((booking) => {
      const userName = booking.user?.firstName && booking.user?.lastName 
        ? `${booking.user.firstName} ${booking.user.lastName}` 
        : booking.user?.email || "A client";
      recentActivities.push({
        type: "booking",
        message: `${userName} made a booking (₦${booking.amount?.toLocaleString() || 0})`,
        createdAt: booking.createdAt,
      });
    });

    // Recent user registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    recentUsers.forEach((user) => {
      const userName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.email || "A user";
      recentActivities.push({
        type: "user_registered",
        message: `${userName} registered as ${user.role || "user"}`,
        createdAt: user.createdAt,
      });
    });

    // Sort by date and get latest 10
    recentActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const limitedActivities = recentActivities.slice(0, 10);

    // Get user growth data (last 7 days)
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 7 },
    ]);

    // Get booking stats by status
    const bookingStats = await Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const bookingsByStatus = {};
    bookingStats.forEach((stat) => {
      bookingsByStatus[stat._id || "unknown"] = stat.count;
    });

    const result = {
      totalUsers,
      totalCourses,
      totalBookings,
      totalRegistrations,
      totalRevenue,
      recentActivities: limitedActivities,
      userGrowth: userGrowth.map((item) => ({
        date: item._id,
        count: item.count,
      })),
      bookingsByStatus,
    };

    console.log("✅ Admin stats fetched successfully");
    return result;
  } catch (error) {
    console.error("❌ Error getting admin stats:", error);
    throw new ApiError(500, "Failed to fetch admin dashboard stats");
  }
};

// ============================================
// Admin Analytics
// ============================================

const getAdminAnalytics = async (period = "month") => {
  try {
    console.log(`🔍 Fetching admin analytics for period: ${period}`);

    // Revenue chart data
    const revenueData = await Payment.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    // Enrollment chart data
    const enrollmentData = await Registration.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    // Booking chart data
    const bookingChartData = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const result = {
      revenue: revenueData.map((item) => ({
        date: item._id,
        amount: item.amount,
      })),
      enrollments: enrollmentData.map((item) => ({
        date: item._id,
        count: item.count,
      })),
      bookings: bookingChartData.map((item) => ({
        date: item._id,
        count: item.count,
      })),
    };

    console.log("✅ Admin analytics fetched successfully");
    return result;
  } catch (error) {
    console.error("❌ Error getting admin analytics:", error);
    throw new ApiError(500, "Failed to fetch admin analytics");
  }
};



// ============================================
// Instructor Stats
// ============================================

// Get instructor dashboard stats
const getInstructorStats = async (userId) => {
  try {
    console.log("🔍 Fetching instructor stats for user:", userId);

    // Get all courses for this instructor
    const courses = await Course.find({ instructor: userId });
    const courseIds = courses.map(c => c._id);
    const totalCourses = courses.length;

    // Get total students (unique students enrolled in instructor's courses)
    const registrations = await Registration.find({
      course: { $in: courseIds },
      paymentStatus: "paid",
      status: "approved",
    });

    // Get unique students
    const studentIds = [...new Set(registrations.map(r => r.student.toString()))];
    const totalStudents = studentIds.length;

    // Get total revenue from course enrollments
    const revenueResult = await Payment.aggregate([
      { 
        $match: { 
          status: "success",
          registration: { $in: registrations.map(r => r._id) }
        } 
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get pending reviews (placeholder - you can implement reviews later)
    const pendingReviews = 0;

    // Get recent enrollments for instructor's courses
    const recentEnrollments = await Registration.find({
      course: { $in: courseIds },
      paymentStatus: "paid",
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("student", "firstName lastName email")
      .populate("course", "title");

    const recentActivity = recentEnrollments.map((reg) => ({
      type: "enrollment",
      message: `${reg.student?.firstName || "A student"} enrolled in "${reg.course?.title || "a course"}"`,
      createdAt: reg.createdAt,
    }));

    const result = {
      totalCourses,
      totalStudents,
      totalRevenue,
      pendingReviews,
      recentActivity,
    };

    console.log("✅ Instructor stats fetched successfully");
    return result;
  } catch (error) {
    console.error("❌ Error getting instructor stats:", error);
    throw new ApiError(500, "Failed to fetch instructor dashboard stats");
  }
};

// Get instructor analytics
const getInstructorAnalytics = async (userId, period = "month") => {
  try {
    console.log(`🔍 Fetching instructor analytics for user: ${userId}, period: ${period}`);

    // Get all courses for this instructor
    const courses = await Course.find({ instructor: userId });
    const courseIds = courses.map(c => c._id);

    // Get enrollment data over time
    const enrollmentData = await Registration.aggregate([
      { 
        $match: { 
          course: { $in: courseIds },
          paymentStatus: "paid",
          status: "approved",
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    // Get revenue data over time
    const revenueData = await Payment.aggregate([
      { 
        $match: { 
          status: "success",
          registration: { $in: await Registration.find({ course: { $in: courseIds } }).distinct('_id') }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    // Get top courses by enrollment
    const topCourses = await Registration.aggregate([
      { 
        $match: { 
          course: { $in: courseIds },
          paymentStatus: "paid",
          status: "approved",
        } 
      },
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Populate course titles
    const topCoursesWithDetails = await Promise.all(
      topCourses.map(async (item) => {
        const course = await Course.findById(item._id);
        return {
          title: course?.title || "Unknown Course",
          students: item.count,
        };
      })
    );

    const result = {
      enrollments: enrollmentData.map((item) => ({
        date: item._id,
        count: item.count,
      })),
      revenue: revenueData.map((item) => ({
        date: item._id,
        amount: item.amount,
      })),
      topCourses: topCoursesWithDetails,
    };

    console.log("✅ Instructor analytics fetched successfully");
    return result;
  } catch (error) {
    console.error("❌ Error getting instructor analytics:", error);
    throw new ApiError(500, "Failed to fetch instructor analytics");
  }
};

// ============================================
// Chart Data Functions
// ============================================

// Get revenue chart data
const getRevenueChart = async (period = "month") => {
  try {
    console.log(`🔍 Fetching revenue chart data for period: ${period}`);

    let dateFormat = "%Y-%m-%d";
    let limit = 30;

    if (period === "week") {
      dateFormat = "%Y-%m-%d";
      limit = 7;
    } else if (period === "month") {
      dateFormat = "%Y-%m-%d";
      limit = 30;
    } else if (period === "year") {
      dateFormat = "%Y-%m";
      limit = 12;
    }

    const data = await Payment.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: limit },
    ]);

    // If no data, return empty array
    if (data.length === 0) {
      console.log("ℹ️ No revenue data found");
      return [];
    }

    // Format data for chart
    const result = data.map((item) => ({
      date: item._id,
      amount: item.amount,
      label: item._id,
    }));

    console.log(`✅ Revenue chart data: ${result.length} entries`);
    return result;
  } catch (error) {
    console.error("❌ Error getting revenue chart data:", error);
    throw new ApiError(500, "Failed to fetch revenue chart data");
  }
};

// Get enrollment chart data
const getEnrollmentChart = async (period = "month") => {
  try {
    console.log(`🔍 Fetching enrollment chart data for period: ${period}`);

    let dateFormat = "%Y-%m-%d";
    let limit = 30;

    if (period === "week") {
      dateFormat = "%Y-%m-%d";
      limit = 7;
    } else if (period === "month") {
      dateFormat = "%Y-%m-%d";
      limit = 30;
    } else if (period === "year") {
      dateFormat = "%Y-%m";
      limit = 12;
    }

    const data = await Registration.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: limit },
    ]);

    if (data.length === 0) {
      console.log("ℹ️ No enrollment data found");
      return [];
    }

    const result = data.map((item) => ({
      date: item._id,
      count: item.count,
      label: item._id,
    }));

    console.log(`✅ Enrollment chart data: ${result.length} entries`);
    return result;
  } catch (error) {
    console.error("❌ Error getting enrollment chart data:", error);
    throw new ApiError(500, "Failed to fetch enrollment chart data");
  }
};

// Get booking chart data
const getBookingChart = async (period = "month") => {
  try {
    console.log(`🔍 Fetching booking chart data for period: ${period}`);

    let dateFormat = "%Y-%m-%d";
    let limit = 30;

    if (period === "week") {
      dateFormat = "%Y-%m-%d";
      limit = 7;
    } else if (period === "month") {
      dateFormat = "%Y-%m-%d";
      limit = 30;
    } else if (period === "year") {
      dateFormat = "%Y-%m";
      limit = 12;
    }

    // ✅ First, check if there are any bookings
    const totalBookings = await Booking.countDocuments();
    console.log(`📊 Total bookings in database: ${totalBookings}`);

    if (totalBookings === 0) {
      console.log("ℹ️ No bookings found in database");
      return [];
    }

    // ✅ Try a simpler aggregation first
    const data = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: limit },
    ]);

    console.log(`📊 Raw booking aggregation result:`, data);

    if (!data || data.length === 0) {
      console.log("ℹ️ No booking data found for the selected period");
      return [];
    }

    const result = data.map((item) => ({
      date: item._id,
      count: item.count,
      label: item._id,
    }));

    console.log(`✅ Booking chart data: ${result.length} entries`);
    return result;
  } catch (error) {
    console.error("❌ Error getting booking chart data:", error);
    console.error("  Error message:", error.message);
    console.error("  Error stack:", error.stack);
    throw new ApiError(500, `Failed to fetch booking chart data: ${error.message}`);
  }
};



// ============================================
// Platform Stats (Super Admin)
// ============================================

// Get platform-wide statistics for Super Admin
const getPlatformStats = async () => {
  try {
    console.log("🔍 Fetching platform stats...");

    // Get all counts (no filters)
    const [
      totalUsers,
      totalCourses,
      totalBookings,
      totalRegistrations,
      totalPayments,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(), // All courses (not just published)
      Booking.countDocuments(),
      Registration.countDocuments({ paymentStatus: "paid", status: "approved" }),
      Payment.countDocuments({ status: "success" }),
    ]);

    // Get revenue
    const revenueResult = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get user counts by role
    const [students, instructors, clients, admins] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "instructor" }),
      User.countDocuments({ role: "client" }),
      User.countDocuments({ role: "admin" }),
    ]);

    // Get recent activities
    const recentActivities = [];

    // Recent user registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("firstName lastName email role createdAt");

    recentUsers.forEach((user) => {
      const userName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.email || "A user";
      recentActivities.push({
        type: "user_registered",
        message: `${userName} registered as ${user.role || "user"}`,
        createdAt: user.createdAt,
      });
    });

    // Recent course creations
    const recentCourses = await Course.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("instructor", "firstName lastName")
      .select("title createdAt");

    recentCourses.forEach((course) => {
      const instructorName = course.instructor?.firstName && course.instructor?.lastName 
        ? `${course.instructor.firstName} ${course.instructor.lastName}` 
        : "An instructor";
      recentActivities.push({
        type: "course_created",
        message: `${instructorName} created course "${course.title}"`,
        createdAt: course.createdAt,
      });
    });

    // Recent enrollments
    const recentEnrollments = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("student", "firstName lastName")
      .populate("course", "title");

    recentEnrollments.forEach((reg) => {
      const studentName = reg.student?.firstName && reg.student?.lastName 
        ? `${reg.student.firstName} ${reg.student.lastName}` 
        : "A student";
      recentActivities.push({
        type: "enrollment",
        message: `${studentName} enrolled in "${reg.course?.title || "a course"}"`,
        createdAt: reg.createdAt,
      });
    });

    // Sort by date and get latest 10
    recentActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const limitedActivities = recentActivities.slice(0, 10);

    const result = {
      totalUsers,
      totalCourses,
      totalBookings,
      totalRegistrations,
      totalPayments,
      totalRevenue,
      students,
      instructors,
      clients,
      admins,
      recentActivities: limitedActivities,
    };

    console.log("✅ Platform stats fetched successfully");
    return result;
  } catch (error) {
    console.error("❌ Error getting platform stats:", error);
    throw new ApiError(500, "Failed to fetch platform stats");
  }
};

// ============================================
// User Growth Chart Data
// ============================================

const getUserGrowthChart = async (period = "month") => {
  try {
    console.log(`🔍 Fetching user growth chart data for period: ${period}`);

    let dateFormat = "%Y-%m-%d";
    let limit = 30;

    if (period === "week") {
      dateFormat = "%Y-%m-%d";
      limit = 7;
    } else if (period === "month") {
      dateFormat = "%Y-%m-%d";
      limit = 30;
    } else if (period === "year") {
      dateFormat = "%Y-%m";
      limit = 12;
    }

    const data = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: limit },
    ]);

    if (data.length === 0) {
      console.log("ℹ️ No user growth data found");
      return [];
    }

    const result = data.map((item) => ({
      date: item._id,
      count: item.count,
      label: item._id,
    }));

    console.log(`✅ User growth chart data: ${result.length} entries`);
    return result;
  } catch (error) {
    console.error("❌ Error getting user growth chart data:", error);
    throw new ApiError(500, "Failed to fetch user growth chart data");
  }
};

// ============================================
// Platform Analytics (Super Admin)
// ============================================

const getPlatformAnalytics = async (period = "month") => {
  try {
    console.log(`🔍 Fetching platform analytics for period: ${period}`);

    // Get revenue data over time
    const revenueData = await Payment.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    // Get enrollment data over time
    const enrollmentData = await Registration.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    // Get top courses by enrollment
    const topCourses = await Registration.aggregate([
      { $match: { paymentStatus: "paid", status: "approved" } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Populate course titles
    const topCoursesWithDetails = await Promise.all(
      topCourses.map(async (item) => {
        const course = await Course.findById(item._id);
        return {
          title: course?.title || "Unknown Course",
          enrollments: item.count,
        };
      })
    );

    // Get top instructors by course count
    const topInstructors = await Course.aggregate([
      { $group: { _id: "$instructor", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Populate instructor names
    const topInstructorsWithDetails = await Promise.all(
      topInstructors.map(async (item) => {
        const instructor = await User.findById(item._id);
        return {
          name: instructor ? `${instructor.firstName} ${instructor.lastName}` : "Unknown Instructor",
          courses: item.count,
        };
      })
    );

    // Get total views, unique visitors, etc. (placeholder - you can implement actual tracking later)
    const totalViews = 0;
    const uniqueVisitors = 0;
    const avgSessionDuration = "0m";
    const bounceRate = "0%";

    const result = {
      totalViews,
      uniqueVisitors,
      avgSessionDuration,
      bounceRate,
      revenue: revenueData.map((item) => ({
        date: item._id,
        amount: item.amount,
      })),
      enrollments: enrollmentData.map((item) => ({
        date: item._id,
        count: item.count,
      })),
      topCourses: topCoursesWithDetails,
      topInstructors: topInstructorsWithDetails,
    };

    console.log("✅ Platform analytics fetched successfully");
    return result;
  } catch (error) {
    console.error("❌ Error getting platform analytics:", error);
    throw new ApiError(500, "Failed to fetch platform analytics");
  }
};

module.exports = {
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
};