const Certificate = require("./certificateModel");

const CourseProgress = require("../courseProgress/progressModel");
const Registration = require("../courseRegistration/registrationModel");

const ApiError = require("../utils/ApiError");

const mongoose = require("mongoose");

// Generate certificate number

const generateCertificateNumber = () => {
  const year = new Date().getFullYear();

  const random = Math.floor(100000 + Math.random() * 900000);

  return `CERT-${year}-${random}`;
};

// Issue certificate

const createCertificate = async (
  data,

  adminId,
) => {
  const progress = await CourseProgress.findOne({
    student: data.student,

    course: data.course,
  });

  if (!progress) {
    throw new ApiError(
      400,

      "Student has no progress record for this course",
    );
  }

  if (progress.status !== "completed") {
    throw new ApiError(
      400,

      "Student has not completed this course",
    );
  }
  const registration = await Registration.findOne({
    student: data.student,

    course: data.course,

    paymentStatus: "paid",

    status: "approved",
  });

  if (!registration) {
    throw new ApiError(
      400,

      "Student does not have a valid enrollment",
    );
  }

  const existingCertificate = await Certificate.findOne({
    student: data.student,

    course: data.course,
  });

  if (existingCertificate) {
    throw new ApiError(
      400,

      "Certificate already exists",
    );
  }

  const certificate = await Certificate.create({
    ...data,

    issuedBy: adminId,

    certificateNumber: generateCertificateNumber(),
  });

  return certificate;
};

// Get student certificates

const getStudentCertificates = async (studentId) => {
  return await Certificate.find({
    student: studentId,
  })

    .populate(
      "course",

      "title image",
    )

    .sort({
      createdAt: -1,
    });
};

// Verify certificate

const verifyCertificate = async (certificateNumber) => {
  const certificate = await Certificate.findOne({
    certificateNumber,
  })

    .populate(
      "student",

      "firstName lastName",
    )

    .populate(
      "course",

      "title",
    );

  if (!certificate) {
    throw new ApiError(
      404,

      "Certificate not found",
    );
  }

  return certificate;
};

// Get all certificates

const getAllCertificates = async () => {
  return await Certificate.find()

    .populate(
      "student",

      "firstName lastName email",
    )

    .populate(
      "course",

      "title",
    )

    .sort({
      createdAt: -1,
    });
};

// Revoke certificate

const revokeCertificate = async (
  id,

  reason,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(
      400,

      "Invalid certificate ID",
    );
  }

  const certificate = await Certificate.findById(id);

  if (!certificate) {
    throw new ApiError(
      404,

      "Certificate not found",
    );
  }

  certificate.status = "revoked";

  certificate.revokedAt = new Date();

  certificate.revocationReason = reason;

  await certificate.save();

  return certificate;
};

module.exports = {
  createCertificate,

  getStudentCertificates,

  verifyCertificate,

  getAllCertificates,

  revokeCertificate,
};
