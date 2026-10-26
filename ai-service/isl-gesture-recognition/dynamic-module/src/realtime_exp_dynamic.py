
# ==========================================================
# Real-Time Dynamic ISL Recognition — Record-then-Predict
# ==========================================================

import cv2
import numpy as np
import mediapipe as mp
import joblib
import tensorflow as tf
import time

from config import *
from preprocess_utils import (
    preprocess_frame,
    extract_features_from_rgb,
    hands as feature_hands
)


# ==========================================================
# STEP 1: Load model and label encoder
# ==========================================================

model = tf.keras.models.load_model(LSTM_MODEL)
encoder = joblib.load(DYNAMIC_LABEL_ENCODER)

print("=" * 60)
print("DYNAMIC ISL RECOGNITION")
print("=" * 60)
print(f"Model: {LSTM_MODEL}")
print(f"Classes: {len(encoder.classes_)}")
print(f"Sequence length: {SEQUENCE_LENGTH}")
print(f"Features per frame: {FEATURES_PER_FRAME}")
print(f"Confidence threshold: {DYNAMIC_CONFIDENCE_THRESHOLD}")
print("=" * 60)


# ==========================================================
# STEP 2: Separate detector for drawing webcam landmarks
# The shared feature detector is used for model features.
# ==========================================================

mp_hands = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils

display_hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=MAX_NUM_HANDS,
    min_detection_confidence=MIN_DETECTION_CONFIDENCE,
    min_tracking_confidence=MIN_TRACKING_CONFIDENCE
)


# ==========================================================
# STEP 3: Prediction helper
# ==========================================================

def predict_gesture(frames_rgb):
    """
    Convert sampled preprocessed RGB frames into a
    (1, SEQUENCE_LENGTH, FEATURES_PER_FRAME) input.
    """

    if len(frames_rgb) != SEQUENCE_LENGTH:
        raise ValueError(
            f"Expected {SEQUENCE_LENGTH} frames, "
            f"received {len(frames_rgb)}."
        )

    print(f"\nExtracting features from {len(frames_rgb)} frames...")
    start_time = time.time()

    # Use exactly the same feature extractor as training.
    sequence = np.stack([
        extract_features_from_rgb(frame)
        for frame in frames_rgb
    ]).astype(np.float32)

    print(f"Feature extraction time: {time.time() - start_time:.2f}s")
    print("Sequence shape:", sequence.shape)

    expected_shape = (SEQUENCE_LENGTH, FEATURES_PER_FRAME)

    if sequence.shape != expected_shape:
        raise ValueError(
            f"Unexpected sequence shape: {sequence.shape}; "
            f"expected {expected_shape}."
        )

    # Check whether any hand landmarks were detected.
    left_hand_coords = sequence[:, 1:64]
    right_hand_coords = sequence[:, 65:128]

    no_left_hand = np.all(left_hand_coords == 0)
    no_right_hand = np.all(right_hand_coords == 0)

    if no_left_hand and no_right_hand:
        return "No hand detected", 0.0, None

    # IMPORTANT:
    # Do not smooth, trim, or apply random test-time
    # augmentation in this baseline. Training used
    # uniformly sampled sequences without these steps.
    model_input = np.expand_dims(sequence, axis=0)

    start_time = time.time()
    probabilities = model.predict(model_input, verbose=0)[0]

    predicted_id = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_id])
    predicted_word = encoder.inverse_transform([predicted_id])[0]

    print(f"Inference time: {time.time() - start_time:.3f}s")
    print(f"Predicted gesture: {predicted_word}")
    print(f"Confidence: {confidence:.3f}")

    # Print the three highest-scoring classes.
    top_indices = np.argsort(probabilities)[-3:][::-1]

    print("\nTop predictions:")
    for class_id in top_indices:
        class_name = encoder.inverse_transform([int(class_id)])[0]
        print(f"  {class_name}: {probabilities[class_id]:.3f}")

    return predicted_word, confidence, probabilities


# ==========================================================
# STEP 4: Recording settings
# ==========================================================

RECORD_SECONDS = 5
PREDICT_DISPLAY_SECONDS = 3


# ==========================================================
# STEP 5: Start webcam
# ==========================================================

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    display_hands.close()
    feature_hands.close()
    raise RuntimeError("Cannot open webcam. Check camera access.")

WINDOW = "Dynamic ISL Recognition"
cv2.namedWindow(WINDOW)

state = "IDLE"  # IDLE | RECORDING | SHOWING

recorded_frames = []
record_start_time = 0.0

prediction_text = ""
prediction_confidence = 0.0
prediction_display_until = 0.0


print("\nPress SPACE to record a gesture.")
print("Sign continuously during the five-second recording.")
print("Press Q to quit.\n")


# ==========================================================
# STEP 6: Main webcam loop
# ==========================================================

try:
    while True:

        ret, frame = cap.read()

        if not ret:
            print("Could not read a frame from the webcam.")
            break

        display = frame.copy()
        now = time.time()

        # --------------------------------------------------
        # RECORDING STATE
        # --------------------------------------------------

        if state == "RECORDING":

            # Use the same letterboxing preprocessing
            # as the dynamic training video pipeline.
            frame_rgb = preprocess_frame(frame)

            recorded_frames.append(frame_rgb)

            # Draw landmarks on the original-size display.
            # This detector is for visualization only.
            display_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            display_results = display_hands.process(display_rgb)

            if display_results.multi_hand_landmarks:
                for landmarks in display_results.multi_hand_landmarks:
                    mp_draw.draw_landmarks(
                        display,
                        landmarks,
                        mp_hands.HAND_CONNECTIONS
                    )

            elapsed = now - record_start_time
            remaining = max(0, RECORD_SECONDS - elapsed)

            cv2.putText(
                display,
                "RECORDING...",
                (30, 60),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.1,
                (0, 0, 255),
                3
            )

            cv2.putText(
                display,
                f"Time left: {remaining:.1f}s",
                (30, 105),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 0, 255),
                2
            )

            cv2.putText(
                display,
                f"Frames captured: {len(recorded_frames)}",
                (30, 145),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (200, 200, 200),
                2
            )

            # End recording and sample a fixed-length sequence.
            if elapsed >= RECORD_SECONDS:

                total_frames = len(recorded_frames)

                if total_frames < 2:
                    prediction_text = "Not enough frames"
                    prediction_confidence = 0.0

                else:
                    # Uniform sampling across the recording.
                    indices = np.linspace(
                        0,
                        total_frames - 1,
                        SEQUENCE_LENGTH
                    ).astype(int)

                    sampled_frames = [
                        recorded_frames[i] for i in indices
                    ]

                    try:
                        word, confidence, _ = predict_gesture(
                            sampled_frames
                        )

                        prediction_confidence = confidence

                        if word == "No hand detected":
                            prediction_text = "No hand detected"

                        elif confidence >= DYNAMIC_CONFIDENCE_THRESHOLD:
                            prediction_text = word

                        else:
                            prediction_text = "Uncertain - try again"

                    except Exception as exc:
                        print(f"Prediction error: {exc}")
                        prediction_text = "Prediction error"
                        prediction_confidence = 0.0

                recorded_frames = []
                state = "SHOWING"
                prediction_display_until = (
                    time.time() + PREDICT_DISPLAY_SECONDS
                )

        # --------------------------------------------------
        # SHOWING STATE
        # --------------------------------------------------

        elif state == "SHOWING":

            if now >= prediction_display_until:
                state = "IDLE"

            else:
                if prediction_confidence >= DYNAMIC_CONFIDENCE_THRESHOLD:
                    color = (0, 255, 0)
                elif prediction_confidence >= 0.4:
                    color = (0, 255, 255)
                else:
                    color = (0, 0, 255)

                cv2.putText(
                    display,
                    f"Prediction: {prediction_text}",
                    (30, 60),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.9,
                    color,
                    2
                )

                cv2.putText(
                    display,
                    f"Confidence: {prediction_confidence:.2f}",
                    (30, 105),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.8,
                    color,
                    2
                )

        # --------------------------------------------------
        # IDLE STATE
        # --------------------------------------------------

        else:
            cv2.putText(
                display,
                "Press SPACE to record gesture",
                (30, 60),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.9,
                (0, 255, 255),
                2
            )

            cv2.putText(
                display,
                f"Recording duration: {RECORD_SECONDS} seconds",
                (30, 105),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (200, 200, 200),
                2
            )

        # --------------------------------------------------
        # Footer
        # --------------------------------------------------

        cv2.putText(
            display,
            "Q: Quit | SPACE: Record",
            (30, display.shape[0] - 25),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (200, 200, 200),
            2
        )

        cv2.imshow(WINDOW, display)

        # --------------------------------------------------
        # Keyboard controls
        # --------------------------------------------------

        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            break

        elif key == ord(" ") and state == "IDLE":
            state = "RECORDING"
            recorded_frames = []
            record_start_time = time.time()

            print(
                f"\nRecording for {RECORD_SECONDS} seconds. "
                "Please perform the gesture now."
            )

finally:
    cap.release()
    cv2.destroyAllWindows()

    display_hands.close()
    feature_hands.close()

    print("\nDynamic ISL recognition stopped.")
