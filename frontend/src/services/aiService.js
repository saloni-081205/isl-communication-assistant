
import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:5000/api",
});

// If your current project uses an Axios JWT interceptor,
// preserve it here. This service does not remove authentication.

const unwrapResponse = (response) => {
    // Express returns { success: true, data: AI_RESULT }
    return response.data?.data ?? response.data;
};

// Static gesture: image -> A-Z / 0-9

export const predictStaticGesture = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile, "gesture.jpg");

  const response = await api.post("/ai/predict", formData);
  return response.data.data;
};

// Keep the response format expected by the existing WebcamPredictor.jsx
export const predictGesture = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile, "gesture.jpg");

  const response = await api.post("/ai/predict", formData);
  return response.data;
};

// Dynamic gesture: video -> phrase
export const predictDynamicGesture = async (videoFile) => {
    const formData = new FormData();

    formData.append(
        "file",
        videoFile,
        videoFile.name || "dynamic-gesture.webm"
    );

    const response = await api.post(
        "/ai/dynamic-predict",
        formData,
        {
            timeout: 120000,
        }
    );

    return unwrapResponse(response);
};



export const generateSentenceSuggestions = async ({
  detectedText,
  mode = "static"
}) => {
  const response = await api.post("/sentences/suggestions", {
    detectedText,
    mode
  });

  return response.data.data.suggestions;
};


export default api;
