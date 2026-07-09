const express = require("express");

const router = express.Router();

const {
  issueCertificate,

  getMyCertificates,

  verifyCertificateNumber,

  getCertificates,

  revokeCertificateRecord,
} = require("./certificateController");

const authMiddleware = require("../middlewares/authMiddleware");

const authorizeRoles = require("../middlewares/roleMiddleware");

// ==============================
// Public Routes
// ==============================

// Verify certificate

router.get(
  "/verify/:certificateNumber",

  verifyCertificateNumber,
);

// ==============================
// Student Routes
// ==============================

// Get my certificates

router.get(
  "/my",

  authMiddleware,

  authorizeRoles(
    "student",

    "client",
  ),

  getMyCertificates,
);

// ==============================
// Admin Routes
// ==============================

// Issue certificate

router.post(
  "/",

  authMiddleware,

  authorizeRoles(
    "superAdmin",

    "admin",
  ),

  issueCertificate,
);

// Get all certificates

router.get(
  "/",

  authMiddleware,

  authorizeRoles(
    "superAdmin",

    "admin",

    "instructor",
  ),

  getCertificates,
);

// Revoke certificate

router.patch(
  "/:id/revoke",

  authMiddleware,

  authorizeRoles(
    "superAdmin",

    "admin",
  ),

  revokeCertificateRecord,
);

module.exports = router;
