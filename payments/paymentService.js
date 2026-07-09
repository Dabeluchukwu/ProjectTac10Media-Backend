// 


// NEW VERSION AFTER CREATING BOOKINGS

// Import Paystack axios configuration
const paystack = require("../config/paystack");

// Import payment model
const Payment = require("./paymentModel");

// Import booking model
const Booking = require("../bookings/bookingModel");

const Registration = require("../courseRegistration/registrationModel");

const CourseProgress = require("../courseProgress/progressModel");

const Course = require("../courses/courseModel");

// Import error handler
const ApiError = require("../utils/ApiError");

// Initialize Paystack payment
const initializePayment = async (userId, paymentData) => {
  console.log("🔍 Payment Service - initializePayment called");
  console.log("  User ID:", userId);
  console.log("  Payment Data:", paymentData);
  
  let amount = paymentData.amount;
  let referenceId = paymentData.referenceId;
  let purpose = paymentData.purpose;
  let bookingId = paymentData.bookingId;
  let registrationId = paymentData.registrationId;

  console.log("  Initial amount:", amount);
  console.log("  Purpose:", purpose);

  // ==========================
  // BOOKING PAYMENT
  // ==========================
  if (purpose === "booking") {
    console.log("🔍 Processing booking payment...");
    console.log("  Booking ID:", bookingId);
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.log("❌ Booking not found:", bookingId);
      throw new ApiError(404, "Booking not found");
    }

    console.log("✅ Booking found:", booking._id);
    console.log("  Amount:", booking.amount);

    amount = booking.amount;
    referenceId = bookingId;
  }

  // ==========================
  // COURSE PAYMENT
  // ==========================
  if (purpose === "course") {
    console.log("🔍 Processing course payment...");
    console.log("  Registration ID:", registrationId);
    
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      console.log("❌ Registration not found:", registrationId);
      throw new ApiError(404, "Registration not found");
    }

    console.log("✅ Registration found:", registration._id);
    console.log("  Amount:", registration.amount);

    const course = await Course.findById(registration.course);
    if (!course) {
      console.log("❌ Course not found:", registration.course);
      throw new ApiError(404, "Course not found");
    }

    amount = registration.amount || course.price;
    referenceId = registrationId;
  }

  // ✅ Validate amount
  if (!amount || amount <= 0) {
    console.log("❌ Amount validation failed. Amount:", amount);
    throw new ApiError(400, "Amount is required and must be greater than 0");
  }

  // Paystack uses kobo
  const reference = `cinema_${Date.now()}`;
  console.log("📤 Generating Paystack reference:", reference);

  try {
    console.log("📤 Calling Paystack API...");
    console.log("  Email:", paymentData.email);
    console.log("  Amount (kobo):", amount * 100);
    console.log("  Reference:", reference);
    // ✅ Always redirect to payment verification page first
    console.log("  Callback URL:", `${process.env.FRONTEND_URL}/payment/verify?purpose=${purpose}`);
    
    const response = await paystack.post("/transaction/initialize", {
      email: paymentData.email,
      amount: amount * 100,
      reference,
      callback_url: `${process.env.FRONTEND_URL}/payment/verify?purpose=${purpose}`,
    });
    
    console.log("✅ Paystack response received");
    console.log("  Status:", response.data.status);
    console.log("  Authorization URL:", response.data.data?.authorization_url);
    
    if (!response.data.status) {
      console.log("❌ Paystack returned error:", response.data.message);
      throw new ApiError(400, response.data.message || "Paystack initialization failed");
    }

    // ✅ Create payment record
    const paymentDataForDB = {
      user: userId,
      purpose: purpose,
      referenceId: referenceId,
      booking: bookingId || null,
      registration: registrationId || null,
      paystackReference: reference,
      amount: amount,
      status: "pending",
    };

    console.log("📝 Creating payment record:", paymentDataForDB);

    const payment = await Payment.create(paymentDataForDB);
    
    console.log("✅ Payment record created:", payment._id);

    return {
      payment,
      authorizationUrl: response.data.data.authorization_url,
    };
  } catch (error) {
    console.error("❌ Paystack API error:", error.response?.data || error.message);
    throw new ApiError(400, error.response?.data?.message || "Payment initialization failed");
  }
};

// Verify Paystack payment
const verifyPayment = async (reference) => {
  console.log("🔍 verifyPayment called with reference:", reference);
  
  // Ask Paystack for transaction status
  const response = await paystack.get(`/transaction/verify/${reference}`);
  const data = response.data.data;
  
  console.log("📥 Paystack verification response:");
  console.log("  Status:", data.status);
  console.log("  Amount:", data.amount);
  console.log("  Reference:", data.reference);

  // Find payment record
  const payment = await Payment.findOne({
    paystackReference: reference,
  });

  if (!payment) {
    console.log("❌ Payment record not found for reference:", reference);
    throw new ApiError(404, "Payment record not found");
  }

  console.log("✅ Payment record found:", payment._id);
  console.log("  Purpose:", payment.purpose);
  console.log("  Registration ID:", payment.registration);
  console.log("  Booking ID:", payment.booking);

  // Update payment status
  if (data.status === "success") {
    console.log("✅ Payment was successful!");
    payment.status = "success";
    
    // ✅ Update booking payment
    if (payment.booking) {
      console.log("🔍 Updating booking:", payment.booking);
      await Booking.findByIdAndUpdate(
        payment.booking,
        {
          paymentStatus: "paid",
          status: "confirmed",
        },
      );
      console.log("✅ Booking updated");
    }

    // ✅ Update course registration payment
    if (payment.registration) {
      console.log("🔍 Updating registration:", payment.registration);
      
      const registration = await Registration.findByIdAndUpdate(
        payment.registration,
        {
          paymentStatus: "paid",
          status: "approved",
        },
        { new: true }
      );

      console.log("✅ Registration updated:", registration);
      console.log("  Payment Status:", registration?.paymentStatus);
      console.log("  Status:", registration?.status);

      if (registration) {
        // Create course progress automatically
        const existingProgress = await CourseProgress.findOne({
          student: registration.student,
          course: registration.course,
        });

        if (!existingProgress) {
          console.log("🔍 Creating progress for student:", registration.student);
          await CourseProgress.create({
            student: registration.student,
            course: registration.course,
            registration: registration._id,
            status: "not-started",
            progressPercentage: 0,
          });
          console.log("✅ Progress created");
        } else {
          console.log("✅ Progress already exists");
        }
      }
    }
  } else {
    console.log("❌ Payment was not successful. Status:", data.status);
    payment.status = "failed";
  }

  await payment.save();
  console.log("✅ Payment record saved");
  
  return payment;
};

// Get user payments
const getMyPayments = async (userId) => {
  const payments = await Payment.find({
    user: userId,
  })
    .populate("booking")
    .populate("registration")
    .sort({
      createdAt: -1,
    });

  return payments;
};

// Get all payments (admin)
const getAllPaymentsService = async () => {
  return await Payment.find()
    .populate("user", "firstName lastName email")
    .populate("booking", "bookingType amount status")
    .populate("registration", "course amount status")
    .sort({ createdAt: -1 });
};

module.exports = {
  initializePayment,
  verifyPayment,
  getMyPayments,
  getAllPaymentsService
};