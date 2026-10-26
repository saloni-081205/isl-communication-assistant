const { validationResult } = require("express-validator");

const userService = require("../services/userService");

// ==========================================
// GET PROFILE
// ==========================================
const getProfile = async (req, res) => {

    try {

        const result = await userService.getProfile(req.user.id);

        if (!result.success) {

            return res.status(404).json(result);

        }

        return res.status(200).json(result);

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// ==========================================
// UPDATE PROFILE
// ==========================================
const updateProfile = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,

                errors: errors.array()

            });

        }

        const result = await userService.updateProfile(

            req.user.id,

            req.body

        );

        if (!result.success) {

            return res.status(404).json(result);

        }

        return res.status(200).json(result);

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// ==========================================
// CHANGE PASSWORD
// ==========================================
const changePassword = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,

                errors: errors.array()

            });

        }

        const result = await userService.changePassword(

            req.user.id,

            req.body

        );

        if (!result.success) {

            return res.status(400).json(result);

        }

        return res.status(200).json(result);

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

module.exports = {

    getProfile,

    updateProfile,

    changePassword

};