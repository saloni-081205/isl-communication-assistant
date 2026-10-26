const axios = require("axios");
const FormData = require("form-data");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

const forwardFile = async (file, endpoint, fallbackName) => {
    if (!AI_SERVICE_URL) {
        throw new Error("AI_SERVICE_URL is not configured");
    }

    const formData = new FormData();

    formData.append("file", file.buffer, {
        filename: file.originalname || fallbackName,
        contentType: file.mimetype
    });

    const response = await axios.post(
        `${AI_SERVICE_URL.replace(/\/$/, "")}${endpoint}`,
        formData,
        {
            headers: formData.getHeaders(),
            timeout: endpoint === "/dynamic-predict"
                ? 120000
                : 15000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        }
    );

    return response.data;
};


// Existing static image recognition
const predictGesture = async (file) => {
    try {
        return await forwardFile(
            file,
            "/predict",
            "frame.jpg"
        );
    } catch (error) {
        console.error(
            "Static AI Service Error:",
            error.response?.data || error.message
        );

        throw new Error("AI service static prediction failed");
    }
};


// New dynamic video recognition
const predictDynamicGesture = async (file) => {
    try {
        return await forwardFile(
            file,
            "/dynamic-predict",
            "gesture.mp4"
        );
    } catch (error) {
        console.error(
            "Dynamic AI Service Error:",
            error.response?.data || error.message
        );

        throw new Error("AI service dynamic prediction failed");
    }
};

module.exports = {
    predictGesture,
    predictDynamicGesture
};