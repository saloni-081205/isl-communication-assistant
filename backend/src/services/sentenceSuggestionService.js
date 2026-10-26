
const phraseSuggestions = {
  Break: [
    "I need a break.",
    "Please take a break.",
    "Let us take a short break."
  ],

  Budget: [
    "What is our budget?",
    "My budget is low.",
    "We need to save money."
  ],

  Busy: [
    "I am busy.",
    "Are you busy now?",
    "I am busy with work."
  ],

  Clean: [
    "Please clean the room.",
    "I want to clean my house.",
    "Keep your hands clean."
  ],

  Close: [
    "Please close the door.",
    "Close the window, please.",
    "The shop is closed."
  ],

  Come: [
    "Please come here.",
    "Come with me.",
    "Come home early."
  ],

  Cook: [
    "I can cook food.",
    "What are you cooking?",
    "Please cook dinner."
  ],

  Cry: [
    "The baby is crying.",
    "Please do not cry.",
    "Why are you crying?"
  ],

  Drink: [
    "I want to drink water.",
    "Please drink some milk.",
    "Do you want a drink?"
  ],

  Exam: [
    "My exam is tomorrow.",
    "I am preparing for my exam.",
    "The exam was easy."
  ],

  Fedup: [
    "I am fed up with this.",
    "I am fed up with waiting.",
    "I am fed up with this problem."
  ],

  Fever: [
    "I have a fever.",
    "I need some medicine.",
    "Please take me to a doctor."
  ],

  Give: [
    "Please give me water.",
    "Give me a pen, please.",
    "Can you give me some help?"
  ],

  "Good afternoon": [
    "Good afternoon, everyone.",
    "Good afternoon, how are you?",
    "Good afternoon, sir."
  ],

  "Good morning": [
    "Good morning, everyone.",
    "Good morning, how are you?",
    "Good morning, teacher."
  ],

  Hello: [
    "Hello, how are you?",
    "Hello, nice to meet you.",
    "Hello, can you help me?"
  ],

  Hug: [
    "Can I give you a hug?",
    "I need a hug.",
    "Please give me a hug."
  ],

  Injury: [
    "I have an injury.",
    "My leg is injured.",
    "Please help me with my injury."
  ],

  Interview: [
    "My interview is today.",
    "I am preparing for an interview.",
    "I have an interview tomorrow."
  ],

  Jump: [
    "Please jump up.",
    "The boy can jump high.",
    "Can you jump over this?"
  ],

  Man: [
    "That man is my father.",
    "The man is waiting outside.",
    "Who is that man?"
  ],

  Tea: [
    "I want some tea.",
    "Would you like some tea?",
    "Please make me a cup of tea."
  ],

  Temple: [
    "I want to visit the temple.",
    "The temple is nearby.",
    "Let us go to the temple."
  ],

  "Thank you": [
    "Thank you for your help.",
    "Thank you very much.",
    "Thank you for coming."
  ],

  "What is your name": [
    "What is your name?",
    "May I know your name?",
    "Please tell me your name."
  ],

  Wife: [
    "She is my wife.",
    "My wife is at home.",
    "My wife is very kind."
  ],

  Wrong: [
    "This answer is wrong.",
    "I made a wrong choice.",
    "Please tell me what is wrong."
  ],

  Writer: [
    "He is a good writer.",
    "I want to become a writer.",
    "The writer wrote a new book."
  ],

  Uncle: [
    "My uncle is coming today.",
    "My uncle lives nearby.",
    "I want to visit my uncle."
  ],

  Vegetables: [
    "I want to buy vegetables.",
    "Please wash the vegetables.",
    "I eat vegetables every day."
  ]
};

const normalizeText = (value) => {
  const text = Array.isArray(value)
    ? value.join(" ")
    : String(value ?? "");

  return text
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const generateSuggestions = ({ detectedText, mode = "static" }) => {
  const normalized = normalizeText(detectedText);

  if (!normalized) {
    return [];
  }

  // Normalize the keys too, so capitalization differences do not matter.
  const normalizedKeys = Object.keys(phraseSuggestions).map((key) => ({
    originalKey: key,
    normalizedKey: normalizeText(key)
  }));

  // 1. Exact match: e.g. "GOOD MORNING"
  const exactMatch = normalizedKeys.find(
    (item) => item.normalizedKey === normalized
  );

  if (exactMatch) {
    return [...phraseSuggestions[exactMatch.originalKey]];
  }

  // 2. Match a known phrase contained in the recognized text.
  // Prefer the longest matching phrase.
  const matchedKey = normalizedKeys
    .filter((item) => normalized.includes(item.normalizedKey))
    .sort(
      (a, b) => b.normalizedKey.length - a.normalizedKey.length
    )[0];

  if (matchedKey) {
    return [...phraseSuggestions[matchedKey.originalKey]];
  }

  // 3. Do not generate generic "I want to say..." sentences.
  // Return no suggestions for unknown phrases.
  return [];
};

module.exports = {
  generateSuggestions
};

