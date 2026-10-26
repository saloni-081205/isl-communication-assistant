const { body } = require("express-validator");

/**
 * ==========================================
 * UPDATE PROFILE VALIDATION
 * ==========================================
 */
const updateProfileValidation = [

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

    body("preferredLanguage")
        .notEmpty()
        .withMessage("Preferred language is required.")
        .isIn(["English", "Hindi", "Gujarati"])
        .withMessage("Preferred language must be English, Hindi or Gujarati.")

];

/**
 * ==========================================
 * CHANGE PASSWORD VALIDATION
 * ==========================================
 */
const changePasswordValidation = [

    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required."),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required.")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long.")

];

module.exports = {

    updateProfileValidation,

    changePasswordValidation

};