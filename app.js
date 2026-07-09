const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./auth/authRoutes");
const userRoutes = require("./users/userRoutes");
const bookingRoutes = require("./bookings/bookingRoutes");
const courseRoutes = require("./courses/courseRoutes");
const registrationRoutes = require("./courseRegistration/registrationRoutes");
const vacancyRoutes = require("./jobs/vacancyRoutes");
const applicationRoutes = require("./jobApplication/applicationRoutes");
const reviewRoutes = require("./reviews/reviewRoutes");
const advertRoutes = require("./advertisements/advertRoutes");
const mediaRoutes = require("./media/mediaRoutes");
const paymentRoutes = require("./payments/paymentRoutes");
const paystackWebhook = require("./payments/paystackWebhook");
const discountRoutes = require("./discounts/discountRoutes");
const contentRoutes = require("./content/contentRoutes");
const serviceRoutes = require("./services/serviceRoutes");
const packageRoutes = require("./servicePackages/packageRoutes");
const bundleRoutes = require("./courseBundles/bundleRoutes");
const progressRoutes = require("./courseProgress/progressRoutes");
const examRoutes = require("./exams/examRoutes");
const certificateRoutes = require("./certificates/certificateRoutes");
const dashboardRoutes = require("./dashboard/dahsboardRoutes");

const errorMiddleware = require("./middlewares/errorMiddleware");
const ApiError = require("./utils/ApiError");

const app = express();

/**
 * Security Middleware
 */
app.use(helmet());

/**
 * CORS Middleware - Fixed for Express 5
 */
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Paystack-Signature", "Accept"],
  exposedHeaders: ["Set-Cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// ✅ Apply CORS to all routes (handles OPTIONS automatically)
app.use(cors(corsOptions));

/**
 * Logger
 */
app.use(morgan("dev"));

/**
 * Paystack webhook requires raw body
 */
app.post(
  "/api/v1/payments/webhook",
  express.raw({
    type: "application/json",
  }),
  paystackWebhook
);

/**
 * Normal body parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health Check
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cinematography Backend API Running",
  });
});

/**
 * Routes
 */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/course-registration", registrationRoutes);
app.use("/api/v1/jobs", vacancyRoutes);
app.use("/api/v1/job-applications", applicationRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/advertisements", advertRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/discounts", discountRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/service-packages", packageRoutes);
app.use("/api/v1/course-bundles", bundleRoutes);
app.use("/api/v1/course-progress", progressRoutes);
app.use("/api/v1/exams", examRoutes);
app.use("/api/v1/certificates", certificateRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

/**
 * 404 Handler
 */
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

/**
 * Error Handler
 */
app.use(errorMiddleware);

module.exports = app;