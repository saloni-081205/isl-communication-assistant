
import { useEffect, useRef, useState } from "react";
import {
    AlertCircle,
    Camera,
    CheckCircle2,
    LoaderCircle,
    RotateCcw,
    Square,
    Video,
} from "lucide-react";
import { predictDynamicGesture } from "../services/aiService";

const RECORDING_DURATION = 5000;

const DynamicGesturePredictor = ({ onPrediction }) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const mountedRef = useRef(false);
    const busyRef = useRef(false);

    const [cameraStarted, setCameraStarted] = useState(false);
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const stopCamera = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        const recorder = recorderRef.current;

        if (recorder?.state === "recording") {
            recorder.onstop = null;
            recorder.stop();
        }

        recorderRef.current = null;

        streamRef.current?.getTracks().forEach((track) => {
            track.stop();
        });

        streamRef.current = null;

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setCameraStarted(false);
        setRecording(false);
    };

    const startCamera = async () => {
        try {
            setError("");

            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error(
                    "Camera access is not supported by this browser."
                );
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user",
                },
                audio: false,
            });

            if (!mountedRef.current) {
                stream.getTracks().forEach((track) => track.stop());
                return;
            }

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setCameraStarted(true);
        } catch (err) {
            console.error("Camera access error:", err);

            setError(
                err.message ||
                "Unable to access the camera. Please allow camera permission."
            );
        }
    };

    const submitVideo = async (blob, mimeType) => {
        if (!blob || blob.size === 0 || busyRef.current) {
            if (mountedRef.current) {
                setError("No video was recorded. Please try again.");
            }
            return;
        }

        busyRef.current = true;

        if (mountedRef.current) {
            setLoading(true);
            setError("");
            setResult(null);
        }

        try {

            const extension = mimeType.includes("mp4") ? "mp4" : "webm";

            const videoFile = new File(
                [blob],
                `dynamic-gesture.${extension}`,
                { type: mimeType }
            );

            console.log("Recorded video:", {
            name: videoFile.name,
            type: videoFile.type,
            size: videoFile.size,
          });


            const prediction = await predictDynamicGesture(videoFile);

            if (!prediction?.success) {
                throw new Error(
                    prediction?.message ||
                    "Unable to recognize this gesture."
                );
            }

            if (!mountedRef.current) {
                return;
            }

            setResult(prediction);

            if (prediction.recognized && prediction.prediction) {
                onPrediction?.(
                    prediction.prediction,
                    prediction
                );
            }
        } catch (err) {
            console.error("Dynamic prediction error:", err);

            if (mountedRef.current) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to connect to the AI service."
                );
            }
        } finally {
            busyRef.current = false;

            if (mountedRef.current) {
                setLoading(false);
            }
        }
    };

    const startRecording = () => {
        const stream = streamRef.current;

        if (
            !stream ||
            !cameraStarted ||
            recording ||
            loading ||
            busyRef.current
        ) {
            return;
        }

        if (!window.MediaRecorder) {
            setError("Video recording is not supported by this browser.");
            return;
        }

        // Try WebM codecs supported by the browser.
        // The FastAPI/OpenCV service must support decoding the chosen codec.
        const mimeType = [
            "video/webm;codecs=vp8",
            "video/webm",
            "video/mp4",
        ].find((type) => MediaRecorder.isTypeSupported(type));

        if (!mimeType) {
            setError("No supported video recording format was found.");
            return;
        }

        try {
            chunksRef.current = [];
            setError("");
            setResult(null);

            const recorder = new MediaRecorder(stream, { mimeType });
            recorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data?.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.onerror = () => {
                if (mountedRef.current) {
                    setRecording(false);
                    setError("Video recording failed. Please try again.");
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, {
                    type: recorder.mimeType || mimeType,
                });

                recorderRef.current = null;

                if (mountedRef.current) {
                    setRecording(false);
                    void submitVideo(
                        blob,
                        recorder.mimeType || mimeType
                    );
                }
            };

            recorder.start(250);
            setRecording(true);

            timerRef.current = setTimeout(() => {
                timerRef.current = null;

                if (recorder.state === "recording") {
                    recorder.stop();
                }
            }, RECORDING_DURATION);
        } catch (err) {
            console.error("Recording error:", err);
            setRecording(false);
            setError("Unable to start recording. Please try again.");
        }
    };

    const stopRecording = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (recorderRef.current?.state === "recording") {
            recorderRef.current.stop();
        }
    };

    const retry = () => {
        setResult(null);
        setError("");
    };

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            if (recorderRef.current?.state === "recording") {
                recorderRef.current.onstop = null;
                recorderRef.current.stop();
            }

            streamRef.current?.getTracks().forEach((track) => {
                track.stop();
            });
        };
    }, []);

    const confidence = Number(result?.confidence);
    const confidencePercent = Number.isFinite(confidence)
        ? confidence
        : 0;

    return (
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                    <Video size={22} />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Dynamic Gesture Recognition
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Record a gesture to recognize its corresponding phrase.
                    </p>
                </div>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover [transform:scaleX(-1)]"
                />

                {!cameraStarted && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white">
                        <Camera size={34} className="mb-3 text-slate-400" />
                        <p className="font-semibold">Camera is off</p>
                        <p className="mt-1 text-sm text-slate-400">
                            Start the camera before recording.
                        </p>
                    </div>
                )}

                {recording && (
                    <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                        Recording · up to 5 seconds
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
                        <LoaderCircle size={30} className="mb-3 animate-spin" />
                        <p className="font-semibold">Recognizing gesture...</p>
                        <p className="mt-1 text-xs text-slate-300">
                            This may take a few seconds.
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                {!cameraStarted ? (
                    <button
                        type="button"
                        onClick={startCamera}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Camera size={18} />
                        Start Camera
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={startRecording}
                            disabled={recording || loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Video size={18} />
                            {recording ? "Recording..." : "Record Gesture"}
                        </button>

                        {recording && (
                            <button
                                type="button"
                                onClick={stopRecording}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                            >
                                <Square size={16} />
                                Stop & Predict
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={stopCamera}
                            disabled={recording || loading}
                            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                            Stop Camera
                        </button>
                    </>
                )}
            </div>

            {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                    <div className="flex items-start gap-3">
                        {result.recognized ? (
                            <CheckCircle2 className="mt-1 shrink-0 text-green-600 dark:text-green-400" />
                        ) : (
                            <AlertCircle className="mt-1 shrink-0 text-amber-600 dark:text-amber-400" />
                        )}

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                {result.recognized
                                    ? "Recognized Gesture"
                                    : "Uncertain Gesture"}
                            </p>

                            <p className="mt-1 break-words text-2xl font-bold text-slate-900 dark:text-white">
                                {result.prediction || "No confident prediction"}
                            </p>

                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Confidence: {confidencePercent.toFixed(1)}%
                            </p>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {result.message}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={retry}
                        disabled={loading || recording}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        <RotateCcw size={15} />
                        Try Again
                    </button>
                </div>
            )}

            <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Keep your hands visible, use good lighting, and perform one
                gesture clearly during recording.
            </p>
        </section>
    );
};

export default DynamicGesturePredictor;
