
const {
  generateSuggestions
} = require("../services/sentenceSuggestionService");

const generateSentenceSuggestions = (req, res) => {
  try {
    const { detectedText, mode = "static" } = req.body;

    if (
      typeof detectedText !== "string" &&
      !Array.isArray(detectedText)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide detectedText as text or an array."
      });
    }

    const normalizedText = Array.isArray(detectedText)
      ? detectedText.join(" ").trim()
      : detectedText.trim();

    if (!normalizedText) {
      return res.status(400).json({
        success: false,
        message: "Detected text cannot be empty."
      });
    }

    if (!["static", "dynamic"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Mode must be static or dynamic."
      });
    }

    const suggestions = generateSuggestions({
      detectedText,
      mode
    });

    return res.status(200).json({
      success: true,
      message: "Sentence suggestions generated successfully.",
      data: {
        detectedText: normalizedText,
        mode,
        suggestions
      }
    });
  } catch (error) {
    console.error("Sentence suggestion error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate sentence suggestions."
    });
  }
};

module.exports = {
  generateSentenceSuggestions
};
