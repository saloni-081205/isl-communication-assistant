import {
    useEffect,
    useRef,
    useState,
} from "react";

import { predictGesture } from "../services/aiService";
import DetectedSequence from "./DetectedSequence";

const WebcamPredictor = ({ onSequenceChange }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    // Prevent multiple prediction requests at the same time
    const predictionInProgressRef = useRef(false);

    // Prediction stability
    const candidatePredictionRef = useRef(null);
    const stableCountRef = useRef(0);

    // Last accepted sign
    const lastAcceptedPredictionRef = useRef(null);

    // After accepting a sign, wait until the user changes
    // the sign before accepting another one.
    const waitingForChangeRef = useRef(false);

    const [cameraStarted, setCameraStarted] = useState(false);

    const [currentPrediction, setCurrentPrediction] =
        useState(null);

    const [currentConfidence, setCurrentConfidence] =
        useState(0);

    const [detectedSequence, setDetectedSequence] =
        useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    /*
     * ---------------------------------------------------------
     * START CAMERA
     * ---------------------------------------------------------
     */

    const startCamera = async () => {
        try {
            setError("");

            if (!navigator.mediaDevices?.getUserMedia) {
                setError(
                    "Camera access is not supported by this browser."
                );
                return;
            }

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: {
                            ideal: 640,
                        },
                        height: {
                            ideal: 480,
                        },
                        facingMode: "user",
                    },
                    audio: false,
                });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                await videoRef.current.play();
            }

            setCameraStarted(true);
        } catch (err) {
            console.error(
                "Camera access error:",
                err
            );

            setError(
                "Unable to access camera. Please allow camera permission."
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * STOP CAMERA
     * ---------------------------------------------------------
     */

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current
                .getTracks()
                .forEach((track) => {
                    track.stop();
                });

            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        predictionInProgressRef.current = false;

        candidatePredictionRef.current = null;
        stableCountRef.current = 0;
        lastAcceptedPredictionRef.current = null;
        waitingForChangeRef.current = false;

        setCameraStarted(false);
        setCurrentPrediction(null);
        setCurrentConfidence(0);
        setLoading(false);
    };

    /*
     * ---------------------------------------------------------
     * PROCESS STABLE PREDICTION
     * ---------------------------------------------------------
     *
     * Example:
     *
     * H
     * H
     * H
     *
     * becomes:
     *
     * H
     *
     * This prevents the same webcam frame/sign from being
     * added repeatedly.
     */

    const processPrediction = (
        prediction,
        confidence
    ) => {
        if (!prediction) {
            return;
        }

        /*
         * If a sign was already accepted, don't accept the
         * exact same sign again until the user changes sign.
         *
         * This is important for:
         *
         * H → E → L → L → O
         *
         * because two L's are possible.
         */
        if (
            waitingForChangeRef.current &&
            prediction !==
                lastAcceptedPredictionRef.current
        ) {
            waitingForChangeRef.current = false;

            candidatePredictionRef.current =
                prediction;

            stableCountRef.current = 1;

            return;
        }

        /*
         * Still waiting for the user to change.
         */
        if (waitingForChangeRef.current) {
            return;
        }

        /*
         * Same candidate prediction
         */
        if (
            prediction ===
            candidatePredictionRef.current
        ) {
            stableCountRef.current += 1;
        } else {
            /*
             * New candidate
             */
            candidatePredictionRef.current =
                prediction;

            stableCountRef.current = 1;
        }

        /*
         * Require 3 consistent predictions
         */
        if (stableCountRef.current >= 2) {
            setDetectedSequence((previous) => {
                const newSequence = [
                    ...previous,
                    prediction,
                ];

                if (onSequenceChange) {
                    onSequenceChange(newSequence);
                }

                return newSequence;
            });

            lastAcceptedPredictionRef.current =
                prediction;

            waitingForChangeRef.current = true;

            candidatePredictionRef.current = null;

            stableCountRef.current = 0;
        }
    };

    /*
     * ---------------------------------------------------------
     * CAPTURE FRAME
     * ---------------------------------------------------------
     */

    const captureFrame = async () => {
        if (
            !videoRef.current ||
            !canvasRef.current ||
            !cameraStarted
        ) {
            return;
        }

        /*
         * Don't send another frame while the previous
         * prediction request is still running.
         */
        if (predictionInProgressRef.current) {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (
            video.readyState <
            HTMLMediaElement.HAVE_CURRENT_DATA
        ) {
            return;
        }

        if (
            video.videoWidth === 0 ||
            video.videoHeight === 0
        ) {
            return;
        }

        const context =
            canvas.getContext("2d");

        if (!context) {
            return;
        }

        /*
         * Use the actual webcam resolution.
         */
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Mirror the frame before sending it to the AI service.
        // This matches cv2.flip(frame, 1) used in
        // realtime_prediction.py.

        // context.save();

        // context.translate(canvas.width, 0);
        // context.scale(-1, 1);

        // context.drawImage(
        //     video,
        //     0,
        //     0,
        //     canvas.width,
        //     canvas.height
        // );

        // context.restore();

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob(
            async (blob) => {
                if (!blob) {
                    return;
                }

                predictionInProgressRef.current =
                    true;

                try {
                    setLoading(true);

                    const result =
                        await predictGesture(blob);

                    console.log(
                        "AI Prediction:",
                        result
                    );

                    /*
                     * Expected Express response:
                     *
                     * {
                     *   success: true,
                     *   data: {
                     *      success: true,
                     *      prediction: "A",
                     *      confidence: 0.98
                     *   }
                     * }
                     */

                    if (
                        result?.success &&
                        result?.data?.success
                    ) {
                        const prediction =
                            result.data.prediction;

                        const confidence =
                            Number(
                                result.data.confidence
                            ) || 0;

                        setCurrentPrediction(
                            prediction
                        );

                        setCurrentConfidence(
                            confidence
                        );

                        /*
                         * Only process predictions with
                         * reasonable confidence.
                         */
                        if (confidence >= 0.6) {
                            processPrediction(
                                prediction,
                                confidence
                            );
                        }
                    } else {
                        /*
                         * No hand detected or prediction
                         * unavailable.
                         */
                        setCurrentPrediction(null);
                        setCurrentConfidence(0);

                        /*
                         * Treat no prediction as a
                         * "release" state.
                         *
                         * This allows:
                         *
                         * L → no hand → L
                         *
                         * to produce:
                         *
                         * L → L
                         */
                        candidatePredictionRef.current =
                            null;

                        stableCountRef.current = 0;

                        waitingForChangeRef.current =
                            false;
                    }
                } catch (err) {
                    console.error(
                        "Prediction request failed:",
                        err
                    );

                    /*
                     * Don't destroy the existing sequence
                     * just because one request failed.
                     */
                    setError(
                        "Unable to connect to the AI service."
                    );
                } finally {
                    setLoading(false);

                    predictionInProgressRef.current =
                        false;
                }
            },
            "image/jpeg",
            0.9
        );
    };

    /*
     * ---------------------------------------------------------
     * CAMERA PREDICTION LOOP
     * ---------------------------------------------------------
     *
     * Start with one request every 800ms.
     *
     * We can optimize this later.
     */

    useEffect(() => {
        if (!cameraStarted) {
            return;
        }

        const intervalId = setInterval(() => {
            captureFrame();
        }, 300);

        return () => {
            clearInterval(intervalId);
        };
    }, [cameraStarted]);

    /*
     * ---------------------------------------------------------
     * CLEANUP
     * ---------------------------------------------------------
     */

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) => {
                        track.stop();
                    });
            }
        };
    }, []);

    /*
     * ---------------------------------------------------------
     * SEQUENCE CONTROLS
     * ---------------------------------------------------------
     */

    const addSpace = () => {
    setDetectedSequence((previous) => {
        if (
            previous.length === 0 ||
            previous[previous.length - 1] === " "
        ) {
            return previous;
        }

        const newSequence = [
            ...previous,
            " ",
        ];

        if (onSequenceChange) {
            onSequenceChange(newSequence);
        }

        return newSequence;
    });
};

    const deleteLast = () => {
    setDetectedSequence((previous) => {
        if (previous.length === 0) {
            return previous;
        }

        const newSequence =
            previous.slice(0, -1);

        if (onSequenceChange) {
            onSequenceChange(newSequence);
        }

        return newSequence;
    });
};

const clearSequence = () => {
    setDetectedSequence([]);

    candidatePredictionRef.current = null;
    stableCountRef.current = 0;
    lastAcceptedPredictionRef.current = null;
    waitingForChangeRef.current = false;

    if (onSequenceChange) {
        onSequenceChange([]);
    }
};

    /*
     * ---------------------------------------------------------
     * UI
     * ---------------------------------------------------------
     */

    return (
        <section className="w-full">

            {/* 
                Desktop:
                Camera + sequence side by side

                Tablet:
                Camera + sequence side by side when possible

                Mobile:
                Camera first
                Sequence below
            */}
            <div
                className="
                    grid
                    grid-cols-1
                    gap-4
                    lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]
                    xl:gap-5
                "
            >

                {/* =================================================
                    CAMERA
                ================================================== */}

                <div className="w-full">

                    <div
                        className="
                            relative
                            aspect-video
                            w-full
                            overflow-hidden
                            rounded-2xl
                            bg-black
                            shadow-sm
                        "
                    >

                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="
                                h-full
                                w-full
                                object-cover
                                [transform:scaleX(-1)]
                            "
                        />

                        {/* Camera OFF */}
                        {!cameraStarted && (
                            <div
                                className="
                                    absolute
                                    inset-0
                                    flex
                                    items-center
                                    justify-center
                                    px-4
                                    text-center
                                "
                            >
                                <div>
                                    <div className="mb-2 text-2xl">
                                        📷
                                    </div>

                                    <p className="text-sm font-medium text-white">
                                        Camera is currently off
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Start the camera to begin
                                        detecting signs
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Current Prediction */}
                        {cameraStarted &&
                            currentPrediction && (
                                <div
                                    className="
                                        absolute
                                        left-3
                                        top-3
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-black/65
                                        px-3
                                        py-2
                                        text-white
                                        backdrop-blur-md
                                        sm:left-4
                                        sm:top-4
                                        sm:px-4
                                        sm:py-3
                                    "
                                >
                                    <p className="text-[9px] uppercase tracking-wider text-slate-300 sm:text-[10px]">
                                        Current Sign
                                    </p>

                                    <div className="mt-0.5 flex items-end gap-2">
                                        <span className="text-2xl font-bold sm:text-3xl">
                                            {currentPrediction}
                                        </span>

                                        <span className="pb-1 text-[10px] text-slate-300 sm:text-xs">
                                            {(
                                                currentConfidence *
                                                100
                                            ).toFixed(1)}
                                            %
                                        </span>
                                    </div>
                                </div>
                            )}

                        {/* Detecting indicator */}
                        {cameraStarted && loading && (
                            <div
                                className="
                                    absolute
                                    bottom-3
                                    right-3
                                    flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    bg-black/60
                                    px-3
                                    py-1.5
                                    text-[10px]
                                    text-white
                                    backdrop-blur-md
                                    sm:bottom-4
                                    sm:right-4
                                    sm:text-xs
                                "
                            >
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

                                Detecting
                            </div>
                        )}
                    </div>

                    {/* Camera button */}
                    <div className="mt-3 flex justify-center sm:mt-4">

                        {!cameraStarted ? (
                            <button
                                type="button"
                                onClick={startCamera}
                                className="
                                    w-full
                                    rounded-xl
                                    bg-blue-600
                                    px-6
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-blue-700
                                    sm:w-auto
                                "
                            >
                                Start Camera
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={stopCamera}
                                className="
                                    w-full
                                    rounded-xl
                                    bg-red-500
                                    px-6
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-red-600
                                    sm:w-auto
                                "
                            >
                                Stop Camera
                            </button>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="mt-2 text-center text-xs text-red-500">
                            {error}
                        </p>
                    )}
                </div>

                {/* =================================================
                    DETECTED SEQUENCE
                ================================================== */}

                <div className="w-full">
                    <DetectedSequence
                        sequence={detectedSequence}
                        onSpace={addSpace}
                        onDelete={deleteLast}
                        onClear={clearSequence}
                    />
                </div>
            </div>

            {/* Hidden canvas */}
            <canvas
                ref={canvasRef}
                className="hidden"
            />
        </section>
    );
};

export default WebcamPredictor;