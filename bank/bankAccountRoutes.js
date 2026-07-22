const express = require("express");
const {
  createBankAccount,
  getBankAccounts,
  updateBankAccount,
  deleteBankAccount,
  toggleBankAccountStatus,
} = require("./bankAccountController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

// ✅ GET - accessible to any authenticated user (no admin role required)
router.get("/", authMiddleware, getBankAccounts);

// ✅ POST, PATCH, DELETE - admin only
router.post("/", authMiddleware, authorizeRoles("admin", "superAdmin"), createBankAccount);
router.patch("/:id", authMiddleware, authorizeRoles("admin", "superAdmin"), updateBankAccount);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "superAdmin"), deleteBankAccount);
router.patch("/:id/toggle", authMiddleware, authorizeRoles("admin", "superAdmin"), toggleBankAccountStatus);

module.exports = router;