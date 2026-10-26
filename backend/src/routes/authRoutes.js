const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator");

// Register User
router.post(
    "/register",
    authValidator.registerValidation,
    authController.registerUser
);
//Login
router.post(
    "/login",
    authValidator.loginValidation,
    authController.loginUser
);

module.exports = router;