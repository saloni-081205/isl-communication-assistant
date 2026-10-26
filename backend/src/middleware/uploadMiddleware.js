const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
    const isStaticImage =
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/webp";

    const isDynamicVideo =
        file.mimetype === "video/mp4" ||
        file.mimetype === "video/webm" ||
        file.mimetype === "video/quicktime" ||
        file.mimetype === "video/x-msvideo" ||
        file.mimetype === "video/x-matroska";

    if (isStaticImage || isDynamicVideo) {
        return callback(null, true);
    }

    callback(
        new Error("Unsupported image or video file type")
    );
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});

module.exports = upload;