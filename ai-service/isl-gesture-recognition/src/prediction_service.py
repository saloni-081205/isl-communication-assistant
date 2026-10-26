import cv2
import mediapipe as mp
import numpy as np
import joblib

from src.config import (
    MODEL_FOLDER,
    RF_MODEL,
    LABEL_ENCODER,
    CONFIDENCE_THRESHOLD,
    MAX_NUM_HANDS,
    MIN_DETECTION_CONFIDENCE
)


class GesturePredictor:

    def __init__(self):

        print("=" * 60)
        print("INITIALIZING ISL GESTURE PREDICTOR")
        print("=" * 60)

        # ==================================================
        # LOAD MODEL
        # ==================================================

        model_info_path = MODEL_FOLDER / "model_info.pkl"

        try:
            model_info = joblib.load(model_info_path)

            self.model = model_info["model"]

            self.confidence_threshold = model_info.get(
                "confidence_threshold",
                CONFIDENCE_THRESHOLD
            )

            print("Model loaded from model_info.pkl")

        except Exception as e:

            print("model_info.pkl could not be loaded.")
            print("Using random_forest_model.pkl instead.")
            print("Reason:", e)

            self.model = joblib.load(RF_MODEL)

            self.confidence_threshold = CONFIDENCE_THRESHOLD

        # ==================================================
        # LOAD LABEL ENCODER
        # ==================================================

        self.label_encoder = joblib.load(
            LABEL_ENCODER
        )

        print(
            "Classes:",
            len(self.label_encoder.classes_)
        )

        print(
            self.label_encoder.classes_
        )

        # ==================================================
        # VERIFY MODEL
        # ==================================================

        if hasattr(self.model, "n_features_in_"):

            print(
                "Model expects features:",
                self.model.n_features_in_
            )

        # ==================================================
        # MEDIAPIPE
        # ==================================================

        self.mp_hands = mp.solutions.hands

        self.hands = self.mp_hands.Hands(

            # IMPORTANT:
            # Same tracking mode as realtime_prediction.py
            static_image_mode=False,

            max_num_hands=MAX_NUM_HANDS,

            min_detection_confidence=
                MIN_DETECTION_CONFIDENCE,

            min_tracking_confidence=0.5
        )

        print("MediaPipe initialized successfully.")
        print("Gesture predictor ready.")
        print("=" * 60)

    # ======================================================
    # HAND ORDERING
    # ======================================================

    def process_hands_correctly(
        self,
        multi_hand_landmarks,
        multi_handedness
    ):

        left_hand = None
        right_hand = None

        if multi_hand_landmarks is None:
            return left_hand, right_hand

        for idx, hand_landmarks in enumerate(
            multi_hand_landmarks
        ):

            handedness = (
                multi_handedness[idx]
                .classification[0]
                .label
            )

            if handedness == "Left":

                left_hand = hand_landmarks

            else:

                right_hand = hand_landmarks

        return left_hand, right_hand

    # ======================================================
    # SINGLE HAND FEATURES
    # ======================================================

    def extract_hand_features(
        self,
        hand_landmarks,
        hand_type
    ):

        # 0 = left
        # 1 = right

        features = [hand_type]

        if hand_landmarks is None:

            features.extend(
                [0.0] * 63
            )

            return features

        # Wrist
        wrist = hand_landmarks.landmark[0]

        wrist_x = wrist.x
        wrist_y = wrist.y
        wrist_z = wrist.z

        # Same normalization as realtime_prediction.py

        for landmark in hand_landmarks.landmark:

            features.extend([
                landmark.x - wrist_x,
                landmark.y - wrist_y,
                landmark.z - wrist_z
            ])

        return features

    # ======================================================
    # LANDMARK FEATURES
    # ======================================================

    def extract_landmark_features(
        self,
        results
    ):

        if results.multi_hand_landmarks is None:

            return None

        left_hand, right_hand = (
            self.process_hands_correctly(
                results.multi_hand_landmarks,
                results.multi_handedness
            )
        )

        left_features = (
            self.extract_hand_features(
                left_hand,
                hand_type=0
            )
        )

        right_features = (
            self.extract_hand_features(
                right_hand,
                hand_type=1
            )
        )

        # VERY IMPORTANT:
        # left first
        # right second

        features = (
            left_features +
            right_features
        )

        features = np.array(
            features,
            dtype=np.float32
        )

        return features

    # ======================================================
    # PREDICT
    # ======================================================

    def predict(self, image):

        # ==================================================
        # IMPORTANT:
        # React sends NORMAL frame.
        #
        # We perform the same flip used by
        # realtime_prediction.py.
        # ==================================================

        image = cv2.flip(
            image,
            1
        )

        # ==================================================
        # BGR → RGB
        # ==================================================

        rgb_image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

        # ==================================================
        # MEDIAPIPE
        # ==================================================

        results = self.hands.process(
            rgb_image
        )

        # ==================================================
        # FEATURES
        # ==================================================

        features = (
            self.extract_landmark_features(
                results
            )
        )

        # ==================================================
        # NO HAND
        # ==================================================

        if features is None:

            return {
                "success": False,
                "prediction": None,
                "confidence": 0.0,
                "confidence_level": "none",
                "message": "No hand detected"
            }

        # ==================================================
        # VERIFY FEATURES
        # ==================================================

        if features.shape[0] != 128:

            print(
                "ERROR: Expected 128 features, got:",
                features.shape[0]
            )

            return {
                "success": False,
                "prediction": None,
                "confidence": 0.0,
                "confidence_level": "none",
                "message": "Invalid feature vector"
            }

        # ==================================================
        # MODEL INPUT
        # ==================================================

        features = features.reshape(
            1,
            -1
        )

        # ==================================================
        # PREDICTION
        # ==================================================

        pred_proba = (
            self.model.predict_proba(
                features
            )[0]
        )

        prediction = int(
            np.argmax(pred_proba)
        )

        confidence = float(
            np.max(pred_proba)
        )

        # ==================================================
        # LABEL
        # ==================================================

        prediction_label = (
            self.label_encoder
            .inverse_transform(
                [prediction]
            )[0]
        )

        # ==================================================
        # DEBUG
        # ==================================================

        print(
            "RAW:",
            prediction_label,
            "| Confidence:",
            round(confidence, 3)
        )

        # ==================================================
        # CONFIDENCE
        # ==================================================

        if confidence >= self.confidence_threshold:

            confidence_level = "high"

        elif confidence >= 0.4:

            confidence_level = "medium"

        else:

            confidence_level = "low"

        # ==================================================
        # RETURN RAW PREDICTION
        #
        # NO BACKEND SMOOTHING
        # ==================================================

        return {

            "success": True,

            "prediction": str(
                prediction_label
            ),

            "confidence": round(
                confidence,
                4
            ),

            "confidence_level":
                confidence_level,

            "message":
                "Prediction successful"
        }

    # ======================================================
    # CLOSE
    # ======================================================

    def close(self):

        self.hands.close()