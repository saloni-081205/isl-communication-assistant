
const express = require("express");

const {
  generateSentenceSuggestions
} = require("../controllers/sentenceController");

const router = express.Router();

router.post("/suggestions", generateSentenceSuggestions);

module.exports = router;
