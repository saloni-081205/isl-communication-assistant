const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const userValidator = require("../validators/userValidator");

// ===============================
// GET USER PROFILE
// ===============================
router.get(
    "/profile",
    authenticateUser,
    userController.getProfile
);

// ===============================
// UPDATE USER PROFILE
// ===============================
router.put(
    "/profile",
    authenticateUser,
    userValidator.updateProfileValidation,
    userController.updateProfile
);

// ===============================
// CHANGE PASSWORD
// ===============================
router.put(
    "/change-password",
    authenticateUser,
    userValidator.changePasswordValidation,
    userController.changePassword
);

module.exports = router;