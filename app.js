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

// ✅ 1. CORS MUST be FIRST
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://project-tac10-media-frontend-jfhv.vercel.app",
    "https://project-tac10-media-frontend.vercel.app",
    "https://projecttac10media-frontend.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Paystack-Signature", "Accept"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 204
};

// Apply CORS
app.use(cors(corsOptions));

// ✅ 2. UPDATED HELMET with Paystack CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://checkout.paystack.com",
          "https://js.paystack.co",
          "https://*.paystack.com",
          "blob:", // ✅ Required for Paystack checkout
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "blob:",
        ],
        connectSrc: [
          "'self'",
          "https://api.paystack.co",
          "https://*.paystack.com",
          "https://checkout.paystack.com",
        ],
        frameSrc: [
          "https://checkout.paystack.com",
          "https://*.paystack.com",
        ],
        fontSrc: [
          "'self'",
          "https:",
          "data:",
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    // ✅ Helps with Paystack iframes
    crossOriginEmbedderPolicy: false,
  })
);

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