import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  CircleStop,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const CameraPanel = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const startCamera = async () => {
    try {
      setCameraError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          "Your browser does not support camera access."
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 720,
          },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraActive(true);
    } catch (error) {
      console.error("Camera error:", error);

      setCameraError(
        "Unable to access your camera. Please allow camera permission and try again."
      );

      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-900/10">

      {/* Decorative background */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex flex-col gap-4 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          {/* Camera icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20">
            <Camera size={24} />
          </div>

          <div>
            <div className="flex items-center gap-2">

              <h2 className="text-xl font-bold text-gray-900">
                Live Camera
              </h2>

              {cameraActive && (
                <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  LIVE
                </span>
              )}

            </div>

            <p className="mt-1 text-sm text-gray-500">
              Position your hand clearly inside the camera frame.
            </p>
          </div>

        </div>

        {/* AI Status */}
        <div className="hidden items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-600 sm:flex">

          <Sparkles size={15} />

          AI Ready

        </div>

      </div>

      {/* Camera Area */}
      <div className="relative p-5 sm:p-6">

        <div className="relative aspect-video min-h-[320px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 shadow-inner">

          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 h-full w-full object-cover ${
              cameraActive ? "block" : "hidden"
            }`}
          />

          {/* Camera Off */}
          {!cameraActive && (
            <div className="absolute inset-0 flex items-center justify-center">

              {/* Background glow */}
              <div className="absolute h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative text-center">

                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-gray-400 backdrop-blur-md">

                  <CameraOff size={34} />

                </div>

                <h3 className="text-lg font-semibold text-white">
                  Camera is currently off
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  Start your camera to begin ISL detection.
                </p>

              </div>

            </div>
          )}

          {/* Camera Overlay */}
          {cameraActive && (
            <>
              {/* Dark gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

              {/* Live indicator */}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">

                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />

                Camera Live

              </div>

              {/* AI Detection badge */}
              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">

                <Sparkles size={14} className="text-cyan-300" />

                AI Detection Ready

              </div>

              Hand positioning guide
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                <div className="relative h-52 w-72 sm:h-64 sm:w-96">

                  {/* Corners

                  <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-cyan-300/80" />

                  <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-cyan-300/80" />

                  <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-cyan-300/80" />

                  <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-cyan-300/80" /> */}

                  {/* Center text

                  <div className="absolute inset-0 flex items-center justify-center">

                    <span className="rounded-full bg-black/30 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
                      Position hand here
                    </span>

                  </div> */}

                </div>

              </div>

              {/* Bottom status
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">

                  <ShieldCheck size={15} className="text-green-400" />

                  Camera secured locally

                </div> 

              </div>*/}
            </>
          )}

        </div>

        {/* Error */}
        {cameraError && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{cameraError}</span>

          </div>
        )}

        {/* Bottom Controls */}
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-lg font-medium text-gray-700">
              {cameraActive
                ? "Ready to detect Indian Sign Language"
                : "Camera detection is paused"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Make sure your hand is clearly visible and well lit.
            </p>

          </div>

          {/* Camera Button */}
          {!cameraActive ? (
            <button
              onClick={startCamera}
              className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl"
            >

              <Camera
                size={20}
                className="transition-transform group-hover:scale-110"
              />

              Start Camera

            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-red-600 hover:to-rose-600 hover:shadow-xl"
            >

              <CircleStop
                size={20}
                className="transition-transform group-hover:scale-110"
              />

              Stop Camera

            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default CameraPanel;