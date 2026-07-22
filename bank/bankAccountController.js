const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const BankAccount = require("./bankAccountModel");

// Create bank account
const createBankAccount = asyncHandler(async (req, res) => {
  const { bankName, accountName, accountNumber } = req.body;

  if (!bankName || !accountName || !accountNumber) {
    throw new ApiError(400, "All fields are required");
  }

  const account = await BankAccount.create({
    bankName,
    accountName,
    accountNumber,
    createdBy: req.user.id,
  });

  res.status(201).json(
    new ApiResponse(201, "Bank account created successfully", account)
  );
});

// Get all bank accounts
const getBankAccounts = asyncHandler(async (req, res) => {
  const accounts = await BankAccount.find().sort({ createdAt: -1 });
  res.status(200).json(
    new ApiResponse(200, "Bank accounts fetched successfully", accounts)
  );
});

// Update bank account
const updateBankAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { bankName, accountName, accountNumber } = req.body;

  const account = await BankAccount.findById(id);
  if (!account) {
    throw new ApiError(404, "Bank account not found");
  }

  if (bankName) account.bankName = bankName;
  if (accountName) account.accountName = accountName;
  if (accountNumber) account.accountNumber = accountNumber;

  await account.save();

  res.status(200).json(
    new ApiResponse(200, "Bank account updated successfully", account)
  );
});

// Delete bank account
const deleteBankAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const account = await BankAccount.findByIdAndDelete(id);
  if (!account) {
    throw new ApiError(404, "Bank account not found");
  }
  res.status(200).json(
    new ApiResponse(200, "Bank account deleted successfully")
  );
});

// Toggle active status
const toggleBankAccountStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const account = await BankAccount.findById(id);
  if (!account) {
    throw new ApiError(404, "Bank account not found");
  }
  account.isActive = !account.isActive;
  await account.save();
  res.status(200).json(
    new ApiResponse(200, `Bank account ${account.isActive ? "activated" : "deactivated"} successfully`, account)
  );
});

module.exports = {
  createBankAccount,
  getBankAccounts,
  updateBankAccount,
  deleteBankAccount,
  toggleBankAccountStatus,
};