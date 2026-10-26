const {
    predictGesture,
    predictDynamicGesture
} = require("../services/aiService");


// Existing static recognition controller
const predict = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        const result = await predictGesture(req.file);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error(
            "Static AI Controller Error:",
            error.message
        );

        return res.status(502).json({
            success: false,
            message: "Unable to process static gesture",
            error: error.message
        });
    }
};


// New dynamic recognition controller
const predictDynamic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No video file provided"
            });
        }

        const result = await predictDynamicGesture(req.file);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error(
            "Dynamic AI Controller Error:",
            error.message
        );

        return res.status(502).json({
            success: false,
            message: "Unable to process dynamic gesture",
            error: error.message
        });
    }
};

module.exports = {
    predict,
    predictDynamic
};