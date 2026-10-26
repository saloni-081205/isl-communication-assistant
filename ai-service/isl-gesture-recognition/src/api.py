from pathlib import Path
import tempfile

import cv2
import numpy as np

from fastapi import FastAPI, UploadFile, File, HTTPException

from src.prediction_service import GesturePredictor
from src.dynamic_prediction_service import DynamicGesturePredictor


app = FastAPI(
    title="ISL Gesture Recognition API",
    description=(
        "Indian Sign Language static and dynamic "
        "gesture recognition service"
    ),
    version="1.1.0",
)


# Keep the existing static predictor separate.
static_predictor = GesturePredictor()

# Load the separately trained dynamic LSTM model.
dynamic_predictor = DynamicGesturePredictor()


@app.get("/")
def root():
    return {
        "message": "ISL Gesture Recognition AI Service",
        "status": "running",
        "docs": "/docs",
        "health": "/health",
        "features": {
            "static": "/predict",
            "dynamic": "/dynamic-predict",
        },
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "isl-ai-service",
        "message": "AI service is running",
        "features": ["static", "dynamic"],
    }


# EXISTING STATIC RECOGNITION — KEEP SEPARATE
@app.post("/predict")
async def predict_gesture(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()

        image_array = np.frombuffer(
            image_bytes,
            dtype=np.uint8,
        )

        image = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR,
        )

        if image is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid image file",
            )

        result = static_predictor.predict(image)
        return result

    except HTTPException:
        raise

    except Exception as error:
        print("Static prediction error:", str(error))

        raise HTTPException(
            status_code=500,
            detail="Static gesture prediction failed",
        )


# NEW DYNAMIC VIDEO RECOGNITION
@app.post("/dynamic-predict")
async def predict_dynamic_gesture(
    file: UploadFile = File(...),
):
    temp_path = None

    try:
        filename = file.filename or "gesture.mp4"
        suffix = Path(filename).suffix.lower()

        # A suffix helps OpenCV choose the appropriate video reader.
        if not suffix:
            suffix = ".mp4"

        # Allow common browser-recorded and uploaded video formats.
        allowed_suffixes = {
            ".mp4", ".webm", ".mov", ".avi", ".mkv"
        }

        if suffix not in allowed_suffixes:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Unsupported video extension. "
                    "Use MP4, WebM, MOV, AVI, or MKV."
                ),
            )

        video_bytes = await file.read()

        if not video_bytes:
            raise HTTPException(
                status_code=400,
                detail="The uploaded video is empty",
            )

        # Prevent unexpectedly large uploads.
        max_size_bytes = 100 * 1024 * 1024

        if len(video_bytes) > max_size_bytes:
            raise HTTPException(
                status_code=413,
                detail="Video size must not exceed 100 MB",
            )

        # OpenCV reads from a temporary file.
        with tempfile.NamedTemporaryFile(
            suffix=suffix,
            delete=False,
        ) as temp_file:
            temp_file.write(video_bytes)
            temp_path = temp_file.name

        # result = dynamic_predictor.predict_video(
        #     temp_path
        #)

        # Diagnostic: check whether OpenCV can decode the uploaded video.
        cap = cv2.VideoCapture(temp_path)

        print("\n--- VIDEO DEBUG ---")
        print("Filename:", filename)
        print("File size:", Path(temp_path).stat().st_size)
        print("OpenCV opened:", cap.isOpened())

        ret, frame = cap.read()

        print("First frame readable:", ret)

        if ret and frame is not None:
            print("Frame dimensions:", frame.shape)

        cap.release()
        print("--- END VIDEO DEBUG ---\n")

        if not ret or frame is None:
            raise HTTPException(
                status_code=400,
                detail="OpenCV cannot decode the uploaded WebM video.",
            )

        result = dynamic_predictor.predict_video(temp_path)

        return result

    except HTTPException:
        raise

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:
        print("Dynamic prediction error:", str(error))

        raise HTTPException(
            status_code=500,
            detail="Dynamic gesture prediction failed",
        )

    finally:
        await file.close()

        if temp_path:
            Path(temp_path).unlink(missing_ok=True)