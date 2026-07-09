// Payment model
const Payment = require("./paymentModel");

const Booking = require("../bookings/bookingModel");

const Registration = require("../courseRegistration/registrationModel");

const CourseProgress = require("../courseProgress/progressModel");

const crypto = require("crypto");

// Handle Paystack webhook

const paystackWebhook = async (req, res) => {
  try {
    // Verify Paystack signature

    const hash = crypto

      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)

      .update(req.body)

      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).json({
        message: "Invalid signature",
      });
    }

    const event = JSON.parse(req.body.toString());

    // Successful payment event

    if (event.event === "charge.success") {
      const reference = event.data.reference;

      const payment = await Payment.findOne({
        paystackReference: reference,
      });

      if (payment) {
        // Prevent duplicate webhook updates

        if (payment.status !== "success") {
          payment.status = "success";

          await payment.save();

          // =========================
          // Update booking payment
          // =========================

          if (payment.booking) {
            await Booking.findByIdAndUpdate(
              payment.booking,

              {
                paymentStatus: "paid",

                status: "confirmed",
              },
            );
          }

          // =========================
          // Update course registration payment
          // =========================
if(payment.registration){


  const registration = await Registration.findByIdAndUpdate(

    payment.registration,

    {

      paymentStatus:"paid",

      status:"approved"

    },

    {
      new:true
    }

  );



  if(registration){


    const existingProgress = await CourseProgress.findOne({

      student: registration.student,

      course: registration.course

    });



    if(!existingProgress){


      await CourseProgress.create({

        student: registration.student,

        course: registration.course,

        registration: registration._id,

        status:"not-started"

      });


    }


  }


}
        }
      }
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = paystackWebhook;
