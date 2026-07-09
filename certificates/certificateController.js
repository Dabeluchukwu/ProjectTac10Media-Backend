const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const {
  createCertificate,

  getStudentCertificates,

  verifyCertificate,

  getAllCertificates,

  revokeCertificate,
} = require("./certificateService");

const {
  createCertificateValidation,

  revokeCertificateValidation,
} = require("./certificateValidation");

// Issue certificate

const issueCertificate = asyncHandler(async (req, res) => {
  const { error } = createCertificateValidation.validate(req.body);

  if (error) {
    throw new Error(error.details[0].message);
  }

  const certificate = await createCertificate(
    req.body,

    req.user.id,
  );

  res.status(201).json(
    new ApiResponse(
      201,

      "Certificate issued successfully",

      certificate,
    ),
  );
});

// Student certificates

const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await getStudentCertificates(req.user.id);

  res.status(200).json(
    new ApiResponse(
      200,

      "Certificates fetched successfully",

      certificates,
    ),
  );
});

// Public certificate verification

const verifyCertificateNumber = asyncHandler(async (req, res) => {
  const certificate = await verifyCertificate(req.params.certificateNumber);

  res.status(200).json(
    new ApiResponse(
      200,

      "Certificate verified successfully",

      certificate,
    ),
  );
});

// Admin view all certificates

const getCertificates = asyncHandler(async (req, res) => {
  const certificates = await getAllCertificates();

  res.status(200).json(
    new ApiResponse(
      200,

      "Certificates fetched successfully",

      certificates,
    ),
  );
});

// Revoke certificate

const revokeCertificateRecord = asyncHandler(async (req, res) => {
  const { error } = revokeCertificateValidation.validate(req.body);

  if (error) {
    throw new Error(error.details[0].message);
  }

  const certificate = await revokeCertificate(
    req.params.id,

    req.body.reason,
  );

  res.status(200).json(
    new ApiResponse(
      200,

      "Certificate revoked successfully",

      certificate,
    ),
  );
});

module.exports = {
  issueCertificate,

  getMyCertificates,

  verifyCertificateNumber,

  getCertificates,

  revokeCertificateRecord,
};
