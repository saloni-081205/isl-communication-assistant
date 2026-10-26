const { validationResult } = require("express-validator");

const authService = require("../services/authService");

const registerUser = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,

                errors: errors.array()

            });

        }

        const result = await authService.register(req.body);

        if (!result.success) {

            return res.status(409).json(result);

        }

        return res.status(201).json(result);

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

const loginUser = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,

                errors: errors.array()

            });

        }

        const result = await authService.login(req.body);

        if (!result.success) {

            return res.status(401).json(result);

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
    registerUser,
    loginUser
};