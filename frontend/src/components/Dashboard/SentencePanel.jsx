import { useEffect, useState } from "react";
import { Volume2 } from 'lucide-react';

// import { saveHistory } from "../../services/historyService";
// import toast from "react-hot-toast";

import {
    generateEnglishSentence,
    translateSentence,
} from "../../utils/sentenceGenerator";

import {
    speakText,
    stopSpeech,
    isSpeechSupported,
} from "../../utils/textToSpeech";



const SentencePanel = ({
    sequence = [],
    initialSentence = "",
}) => {

    const hasDynamicSentence = Boolean(initialSentence.trim());

    const [englishSentence, setEnglishSentence] =
        useState("");

    const [hindiSentence, setHindiSentence] =
        useState("");

    const [gujaratiSentence, setGujaratiSentence] =
        useState("");

    const [generated, setGenerated] =
        useState(false);

    /* =========================================================
       TEXT-TO-SPEECH STATES
    ========================================================= */

    const [selectedLanguage, setSelectedLanguage] =
        useState("english");

    const [isSpeakingNow, setIsSpeakingNow] =
        useState(false);



    // const [isSaving, setIsSaving] = useState(false);


    /* =========================================================
       RESET WHEN DETECTED SEQUENCE CHANGES
    ========================================================= */

    useEffect(() => {
    if (!sequence.length && !initialSentence.trim()) {
        setEnglishSentence("");
        setHindiSentence("");
        setGujaratiSentence("");
        setGenerated(false);

        stopSpeech();
        setIsSpeakingNow(false);

        return;
    }

    // A new static sequence or dynamic phrase needs generation.
    setGenerated(false);

    stopSpeech();
    setIsSpeakingNow(false);
}, [sequence, initialSentence]);


    /* =========================================================
       GENERATE SENTENCE
    ========================================================= */

    const handleGenerateSentence = () => {
    if (!sequence.length && !initialSentence.trim()) {
        return;
    }

    // Dynamic gestures already return a complete phrase.
    // Static gestures continue using the existing sentence generator.
    const english = initialSentence.trim()
        ? initialSentence.trim()
        : generateEnglishSentence(sequence);

    const translated = translateSentence(english);

    setEnglishSentence(english);
    setHindiSentence(translated.hindi);
    setGujaratiSentence(translated.gujarati);

    setGenerated(true);
    setSelectedLanguage("english");

    stopSpeech();
    setIsSpeakingNow(false);
};


    /* =========================================================
       GET SELECTED SENTENCE
    ========================================================= */

    const getSelectedSentence = () => {

        switch (selectedLanguage) {

            case "hindi":
                return hindiSentence;

            case "gujarati":
                return gujaratiSentence;

            case "english":
            default:
                return englishSentence;
        }
    };


    /* =========================================================
       GET SELECTED LANGUAGE CODE
    ========================================================= */

    const getSpeechLanguage = () => {

        switch (selectedLanguage) {

            case "hindi":
                return "hi-IN";

            case "gujarati":
                return "gu-IN";

            case "english":
            default:
                return "en-IN";
        }
    };


    /* =========================================================
       SPEAK SELECTED LANGUAGE
    ========================================================= */

    const handleSpeak = () => {

        const sentence =
            getSelectedSentence();

        if (!sentence?.trim()) {
            return;
        }

        if (!isSpeechSupported()) {

            alert(
                "Text-to-Speech is not supported by your browser."
            );

            return;
        }

        setIsSpeakingNow(true);

        speakText(
            sentence,
            {
                lang: getSpeechLanguage(),

                rate: 0.9,

                pitch: 1,

                volume: 1,

                onEnd: () => {
                    setIsSpeakingNow(false);
                },

                onError: () => {
                    setIsSpeakingNow(false);
                },
            }
        );
    };


    /* =========================================================
       STOP SPEAKING
    ========================================================= */

    const handleStopSpeaking = () => {

        stopSpeech();

        setIsSpeakingNow(false);
    };


    /* =========================================================
       CHANGE LANGUAGE
    ========================================================= */

    const handleLanguageChange = (event) => {

        const language =
            event.target.value;

        /*
         * Stop currently speaking sentence
         * when language changes.
         */

        stopSpeech();

        setIsSpeakingNow(false);

        setSelectedLanguage(language);
    };



//     const handleSaveHistory = async () => {

//     if (!sequence.length) {

//         toast.error(
//             "Detect some signs first"
//         );

//         return;
//     }


//     if (!generated) {

//         toast.error(
//             "Generate a sentence before saving"
//         );

//         return;
//     }


//     try {

//         setIsSaving(true);


//         const detectedWord =
//             sequence.join("");


//         await saveHistory({

//             detectedWord,

//             // Your AI confidence isn't currently
//             // passed into SentencePanel.
//             // Therefore we keep this null.

//             confidenceScore: null,

//             generatedSentence:
//                 englishSentence,

//             contextMode:
//                 "General",

//             englishText:
//                 englishSentence,

//             hindiText:
//                 hindiSentence,

//             gujaratiText:
//                 gujaratiSentence,
//         });


//         toast.success(
//             "Conversation saved successfully"
//         );

//     } catch (error) {

//         console.error(
//             "Save conversation error:",
//             error
//         );

//         toast.error(
//             error.response?.data?.message ||
//             "Failed to save conversation"
//         );

//     } finally {

//         setIsSaving(false);
//     }
// };


    /* =========================================================
       RENDER
    ========================================================= */

return (

    <section
        className="
            w-full
            rounded-2xl
            bg-white
            dark:bg-slate-900
            p-4
            shadow-sm
            dark:shadow-black/20
            sm:p-5
            lg:p-6
            transition-colors
            duration-300
        "
    >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
            className="
                mb-4
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >

            <div className="flex items-center gap-2">

                <div>

                    <h2
                        className="
                            text-sm
                            font-semibold
                            text-slate-800
                            dark:text-white
                            sm:text-base
                        "
                    >
                        Generated Sentence
                    </h2>

                    <p
                        className="
                            mt-0.5
                            text-[10px]
                            text-slate-500
                            dark:text-slate-400
                            sm:text-xs
                        "
                    >
                        Convert your detected signs into
                        meaningful communication.
                    </p>

                </div>

            </div>

            {/* =================================================
                RIGHT SIDE
                LANGUAGE + GENERATE BUTTON
            ================================================= */}

            <div
                className="
                    flex
                    w-full
                    flex-col
                    gap-2
                    sm:w-auto
                    sm:flex-row
                    sm:items-center
                "
            >

                {/* LANGUAGE SELECTOR */}

                <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    disabled={!generated}
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        dark:border-slate-700
                        dark:bg-slate-800
                        px-3
                        py-2.5
                        text-xs
                        font-semibold
                        text-slate-700
                        dark:text-slate-200
                        outline-none
                        transition
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-100
                        dark:focus:ring-blue-900
                        disabled:cursor-not-allowed
                        disabled:bg-slate-50
                        disabled:text-slate-400
                        dark:disabled:bg-slate-950
                        dark:disabled:text-slate-600
                        sm:w-auto
                        sm:text-sm
                    "
                >

                    <option value="english">
                        English
                    </option>

                    <option value="hindi">
                        हिन्दी (Hindi)
                    </option>

                    <option value="gujarati">
                        ગુજરાતી (Gujarati)
                    </option>

                </select>

                {/* GENERATE BUTTON */}

                <button
                    type="button"
                    onClick={handleGenerateSentence}
                    disabled={!sequence.length && !initialSentence.trim()}
                    className="
                        w-full
                        rounded-xl
                        bg-gradient-to-r
                        from-purple-600
                        to-blue-600
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:from-purple-700
                        hover:to-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        sm:w-auto
                        sm:px-5
                        sm:text-sm
                    "
                >
                    Generate Sentence
                </button>

            </div>

        </div>


        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!generated ? (

            <div
                className="
                    flex
                    min-h-[130px]
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-slate-200
                    dark:border-slate-700
                    bg-slate-50
                    dark:bg-slate-950
                    px-4
                    text-center
                    sm:min-h-[150px]
                "
            >

                <div>

                    <div className="mb-2 text-2xl">
                        ✨
                    </div>

                    <p
                        className="
                            text-xs
                            font-medium
                            text-slate-600
                            dark:text-slate-300
                            sm:text-sm
                        "
                    >
                        {(sequence.length > 0 || hasDynamicSentence)
                            ? "Your sentence is ready to generate"
                            : "Detect some signs first"}
                    </p>

                    <p
                        className="
                            mt-1
                            text-[10px]
                            text-slate-400
                            dark:text-slate-500
                            sm:text-xs
                        "
                    >
                        {(sequence.length > 0 || hasDynamicSentence)
                            ? "Click Generate Sentence"
                            : "Detected signs will appear here"}
                    </p>

                </div>

            </div>

        ) : (

            <div className="space-y-3">

                {/* =================================================
                    GENERATED MESSAGE
                ================================================= */}

                <div
                    className="
                        rounded-xl
                        border
                        border-blue-100
                        dark:border-blue-900
                        bg-blue-50
                        dark:bg-blue-950/40
                        p-4
                        sm:p-5
                    "
                >

                    <div
                        className="
                            mb-2
                            flex
                            items-center
                            justify-between
                            gap-2
                        "
                    >

                        <span
                            className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-blue-600
                                dark:text-blue-400
                                sm:text-[10px]
                            "
                        >
                            Generated Message
                        </span>

                        <span
                            className="
                                text-[9px]
                                font-medium
                                text-slate-400
                                dark:text-slate-500
                            "
                        >
                            {selectedLanguage === "english"
                                ? "ENGLISH"
                                : selectedLanguage === "hindi"
                                    ? "HINDI"
                                    : "GUJARATI"}
                        </span>

                    </div>


                    {/* SELECTED LANGUAGE SENTENCE */}

                    <p
                        className="
                            break-words
                            text-lg
                            font-bold
                            leading-relaxed
                            text-slate-800
                            dark:text-white
                            sm:text-xl
                        "
                    >
                        {getSelectedSentence()}
                    </p>

                </div>


                {/* =================================================
                    TEXT TO SPEECH BUTTONS
                ================================================= */}

                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    "
                >

                    {!isSpeakingNow ? (

                        <button
                            type="button"
                            onClick={handleSpeak}
                            disabled={
                                !getSelectedSentence()?.trim()
                            }
                            className="
                                w-full
                                rounded-xl
                                bg-gradient-to-r
                                from-purple-600
                                to-blue-600
                                px-4
                                py-2.5
                                text-xs
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:from-purple-700
                                hover:to-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                sm:w-auto
                                sm:px-5
                                sm:text-sm
                            "
                        >

                            <span className="inline-flex items-center gap-1.5">
                                <Volume2 />
                                Speak
                            </span>

                        </button>

                    ) : (

                        <button
                            type="button"
                            onClick={handleStopSpeaking}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-red-500
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-red-600
                            "
                        >

                            <span>
                                ⏹
                            </span>

                            Stop

                        </button>

                    )}

                    {/* <button
    type="button"
    onClick={handleSaveHistory}
    disabled={isSaving || !generated}
    className="
        w-full
        rounded-xl
        border
        border-blue-200
        dark:border-blue-900
        bg-blue-50
        dark:bg-blue-950/40
        px-4
        py-2.5
        text-xs
        font-semibold
        text-blue-600
        dark:text-blue-400
        transition
        hover:bg-blue-100
        dark:hover:bg-blue-950/70
        disabled:cursor-not-allowed
        disabled:opacity-40
        sm:w-auto
        sm:px-5
        sm:text-sm
    "
>
    {isSaving
        ? "Saving..."
        : "Save Conversation"}
</button> */}

                </div>


                {/* =================================================
                    TRANSLATIONS
                ================================================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-2
                    "
                >

                    {/* =================================================
                        HINDI
                    ================================================= */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-100
                            dark:border-slate-800
                            bg-white
                            dark:bg-slate-800
                            p-4
                            shadow-sm
                            dark:shadow-black/20
                        "
                    >

                        <div
                            className="
                                mb-2
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <span
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Hindi
                            </span>

                            <span
                                className="
                                    text-[10px]
                                    text-slate-400
                                    dark:text-slate-500
                                "
                            >
                                IN
                            </span>

                        </div>


                        <p
                            className="
                                break-words
                                text-base
                                font-medium
                                leading-relaxed
                                text-slate-700
                                dark:text-slate-200
                                sm:text-lg
                            "
                        >
                            {hindiSentence}
                        </p>

                    </div>


                    {/* =================================================
                        GUJARATI
                    ================================================= */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-100
                            dark:border-slate-800
                            bg-white
                            dark:bg-slate-800
                            p-4
                            shadow-sm
                            dark:shadow-black/20
                        "
                    >

                        <div
                            className="
                                mb-2
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <span
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                Gujarati
                            </span>

                            <span
                                className="
                                    text-[10px]
                                    text-slate-400
                                    dark:text-slate-500
                                "
                            >
                                IN
                            </span>

                        </div>


                        <p
                            className="
                                break-words
                                text-base
                                font-medium
                                leading-relaxed
                                text-slate-700
                                dark:text-slate-200
                                sm:text-lg
                            "
                        >
                            {gujaratiSentence}
                        </p>

                    </div>

                </div>


                {/* =================================================
                    DETECTED SEQUENCE PREVIEW
                ================================================= */}

                <div
                    className="
                        rounded-xl
                        bg-slate-50
                        dark:bg-slate-950
                        px-3
                        py-2.5
                        sm:px-4
                        sm:py-3
                    "
                >

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-1.5
                        "
                    >

                        <span
                            className="
                                mr-1
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-400
                                dark:text-slate-500
                            "
                        >
                            Detected:
                        </span>


                        {(
    hasDynamicSentence
        ? initialSentence.split(/\s+/)
        : sequence
).map((item, index) => (
    <span
        key={`${item}-${index}`}
        className="
            rounded-md
            bg-white
            dark:bg-slate-800
            px-2
            py-1
            text-[10px]
            font-bold
            text-slate-600
            dark:text-slate-300
            shadow-sm
            dark:shadow-black/20
        "
    >
        {item === " " ? "␣" : item}
    </span>
))}

                    </div>

                </div>

            </div>

        )}

    </section>
);
    
};

export default SentencePanel;