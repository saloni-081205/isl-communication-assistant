
import { useState } from "react";

import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import SentencePanel from "../../components/Dashboard/SentencePanel";
import WebcamPredictor from "../../components/WebcamPredictor";
import DynamicGesturePredictor from "../../components/DynamicGesturePredictor";
import SentenceSuggestions from "../../components/Dashboard/SentenceSuggestions";

import { Camera, Video } from "lucide-react";

const Dashboard = () => {
    const [detectedSequence, setDetectedSequence] = useState([]);
    const [recognitionMode, setRecognitionMode] = useState("static");
    const [dynamicPhrase, setDynamicPhrase] = useState("");
    const [selectedSentence, setSelectedSentence] = useState("");

    const handleStaticSequenceChange = (sequence) => {
    setDetectedSequence(sequence);
    setDynamicPhrase("");
    setSelectedSentence("");
};

const handleDynamicPrediction = (phrase, predictionResult) => {
    if (!predictionResult?.recognized || !phrase?.trim()) {
        return;
    }

    setDynamicPhrase(phrase.trim());
    setSelectedSentence("");
};

const handleModeChange = (mode) => {
    setRecognitionMode(mode);
    setSelectedSentence("");

    if (mode === "static") {
        setDynamicPhrase("");
    } else {
        setDetectedSequence([]);
    }
};

    return (
        <div
            className="
                min-h-screen
                bg-gradient-to-br
                from-slate-50
                via-blue-50
                to-cyan-50
                transition-colors
                dark:from-slate-950
                dark:via-slate-900
                dark:to-blue-950
            "
        >
            <DashboardNavbar />

            <main
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-6
                    sm:px-6
                    sm:py-8
                    lg:px-8
                "
            >
                {/* Page heading */}
                <div className="mb-6 sm:mb-8">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span
                            className="
                                rounded-full
                                bg-blue-100
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-blue-700
                                dark:bg-blue-500/10
                                dark:text-blue-400
                            "
                        >
                            AI Communication Assistant
                        </span>

                        <span
                            className="
                                flex
                                items-center
                                gap-1
                                text-xs
                                font-medium
                                text-green-600
                                dark:text-green-400
                            "
                        >
                            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                            System Ready
                        </span>
                    </div>

                    <h1
                        className="
                            text-2xl
                            font-extrabold
                            text-gray-900
                            transition-colors
                            dark:text-white
                            sm:text-3xl
                            lg:text-4xl
                        "
                    >
                        Let's Communicate
                    </h1>

                    <p
                        className="
                            mt-2
                            max-w-2xl
                            text-xs
                            leading-5
                            text-gray-600
                            dark:text-slate-400
                            sm:text-sm
                            sm:leading-6
                        "
                    >
                        Use Indian Sign Language to communicate naturally.
                        Our AI detects static signs and dynamic gestures to
                        help transform them into meaningful communication.
                    </p>
                </div>

                {/* Recognition mode selector */}
                <section className="mb-5">
                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-2
                        "
                    >
                        <button
                            type="button"
                            onClick={() => handleModeChange("static")}
                            aria-pressed={recognitionMode === "static"}
                            className={`
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                p-4
                                text-left
                                transition
                                ${
                                    recognitionMode === "static"
                                        ? "border-blue-500 bg-blue-50 shadow-md dark:border-blue-400 dark:bg-blue-500/10"
                                        : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
                                }
                            `}
                        >
                            <span
                                className={`
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    ${
                                        recognitionMode === "static"
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                    }
                                `}
                            >
                                <Camera size={21} />
                            </span>

                            <span>
                                <span className="block font-bold text-slate-900 dark:text-white">
                                    Static Gestures
                                </span>
                                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                                    Recognize letters A–Z and digits 0–9
                                </span>
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleModeChange("dynamic")}
                            aria-pressed={recognitionMode === "dynamic"}
                            className={`
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                p-4
                                text-left
                                transition
                                ${
                                    recognitionMode === "dynamic"
                                        ? "border-purple-500 bg-purple-50 shadow-md dark:border-purple-400 dark:bg-purple-500/10"
                                        : "border-slate-200 bg-white hover:border-purple-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
                                }
                            `}
                        >
                            <span
                                className={`
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    ${
                                        recognitionMode === "dynamic"
                                            ? "bg-purple-600 text-white"
                                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                    }
                                `}
                            >
                                <Video size={21} />
                            </span>

                            <span>
                                <span className="block font-bold text-slate-900 dark:text-white">
                                    Dynamic Gestures
                                </span>
                                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                                    Recognize movements and phrases
                                </span>
                            </span>
                        </button>
                    </div>
                </section>

                {/* Selected recognition component */}
                <section className="w-full">
                    {recognitionMode === "static" ? (
                        <WebcamPredictor
                            onSequenceChange={handleStaticSequenceChange}
                        />
                    ) : (
                        <DynamicGesturePredictor
                            onPrediction={handleDynamicPrediction}
                        />
                    )}
                </section>

                {/* Rule-based English sentence suggestions */}
                <section className="mt-5 sm:mt-6">
                    <SentenceSuggestions
                        detectedText={
                            recognitionMode === "dynamic"
                                ? dynamicPhrase
                                : detectedSequence.join("")
                        }
                        mode={recognitionMode}
                        onSelect={setSelectedSentence}
                    />
                </section>

                {/* Existing sentence, translation and speech panel */}
                <section className="mt-5 sm:mt-6">
                    <SentencePanel
                        sequence={detectedSequence}
                        initialSentence={selectedSentence || dynamicPhrase}
                    />
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
