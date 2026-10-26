
from pathlib import Path
import sys

import cv2
import joblib
import numpy as np
import tensorflow as tf


# Project paths
PROJECT_DIR = Path(__file__).resolve().parent.parent

DYNAMIC_MODULE_DIR = PROJECT_DIR / "dynamic-module"
DYNAMIC_SRC_DIR = DYNAMIC_MODULE_DIR / "src"
DYNAMIC_MODELS_DIR = DYNAMIC_MODULE_DIR / "models"

LSTM_MODEL_PATH = DYNAMIC_MODELS_DIR / "lstm_model.keras"
LABEL_ENCODER_PATH = (
    DYNAMIC_MODELS_DIR / "dynamic_label_encoder.pkl"
)

SEQUENCE_LENGTH = 90
FEATURES_PER_FRAME = 128
CONFIDENCE_THRESHOLD = 0.6


if str(DYNAMIC_SRC_DIR) not in sys.path:
    sys.path.insert(0, str(DYNAMIC_SRC_DIR))

from preprocess_utils import (  # noqa: E402
    preprocess_frame,
    extract_features_from_rgb,
)


class DynamicGesturePredictor:

    def __init__(self):
        if not LSTM_MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Dynamic LSTM model not found: {LSTM_MODEL_PATH}"
            )

        if not LABEL_ENCODER_PATH.exists():
            raise FileNotFoundError(
                f"Dynamic label encoder not found: {LABEL_ENCODER_PATH}"
            )

        self.model = tf.keras.models.load_model(
            str(LSTM_MODEL_PATH)
        )

        self.label_encoder = joblib.load(
            LABEL_ENCODER_PATH
        )

    def _extract_video_sequence(self, video_path):
        """Read the video sequentially and sample 90 frames."""

        cap = cv2.VideoCapture(str(video_path))

        if not cap.isOpened():
            raise ValueError(
                "Unable to open video. Check its format or codec."
            )

        frames = []

        try:
            # Do not rely on CAP_PROP_FRAME_COUNT.
            # It can be zero for some WebM recordings.
            while True:
                success, frame_bgr = cap.read()

                if not success or frame_bgr is None:
                    break

                frames.append(frame_bgr)

        finally:
            cap.release()

        if not frames:
            raise ValueError(
                "No readable frames found in the uploaded video."
            )

        print(f"Dynamic video: decoded {len(frames)} frames")

        # Select 90 frames uniformly, repeating frames when the
        # recording contains fewer than 90 frames.
        indices = np.linspace(
            0,
            len(frames) - 1,
            SEQUENCE_LENGTH,
            dtype=int,
        )

        sequence = []

        for frame_index in indices:
            frame_rgb = preprocess_frame(frames[frame_index])

            features = np.asarray(
                extract_features_from_rgb(frame_rgb),
                dtype=np.float32,
            ).reshape(-1)

            if features.shape[0] != FEATURES_PER_FRAME:
                raise ValueError(
                    "Expected 128 features per frame, "
                    f"received {features.shape[0]}."
                )

            sequence.append(features)

        sequence = np.asarray(sequence, dtype=np.float32)

        expected_shape = (SEQUENCE_LENGTH, FEATURES_PER_FRAME)

        if sequence.shape != expected_shape:
            raise ValueError(
                f"Invalid sequence shape: {sequence.shape}"
            )

        if not np.isfinite(sequence).all():
            raise ValueError(
                "Extracted sequence contains invalid values."
            )

        return sequence

    def predict_video(self, video_path):
        sequence = self._extract_video_sequence(video_path)

        probabilities = self.model.predict(
            np.expand_dims(sequence, axis=0),
            verbose=0,
        )[0]

        class_index = int(np.argmax(probabilities))
        confidence = float(probabilities[class_index])

        predicted_label = self.label_encoder.inverse_transform(
            [class_index]
        )[0]

        is_recognized = confidence >= CONFIDENCE_THRESHOLD

        return {
            "success": True,
            "mode": "dynamic",
            "prediction": (
                str(predicted_label) if is_recognized else None
            ),
            "confidence": round(confidence * 100, 2),
            "confidence_threshold": CONFIDENCE_THRESHOLD * 100,
            "recognized": is_recognized,
            "message": (
                "Dynamic gesture recognized"
                if is_recognized
                else "Uncertain gesture. Please try again."
            ),
        }
