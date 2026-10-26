const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    predict,
    predictDynamic
} = require("../controllers/aiController");

// Existing static image recognition
router.post(
    "/predict",
    upload.single("file"),
    predict
);

// New dynamic video recognition
router.post(
    "/dynamic-predict",
    upload.single("file"),
    predictDynamic
);

module.exports = router;