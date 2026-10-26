const { body } = require("express-validator");

const registerValidation = [

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("First name must be between 2 and 100 characters."),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Last name must be between 2 and 100 characters."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),

    body("preferredLanguage")
        .optional()
        .isIn(["English", "Hindi", "Gujarati"])
        .withMessage("Invalid preferred language.")

];

const loginValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email address."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")

];

module.exports = {
    registerValidation,
    loginValidation
};