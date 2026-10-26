import { useEffect, useState } from "react";
import { generateSentenceSuggestions } from "../../services/aiService";

const SentenceSuggestions = ({
    detectedText,
    mode = "static",
    onSelect
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState("");

    const hasRecognizedText = Boolean(
        detectedText && detectedText.trim()
    );

    useEffect(() => {
        // Clear previous suggestions if there is no recognized text.
        setSuggestions([]);
        setSelected("");
        setError("");

        if (!hasRecognizedText) {
            onSelect?.("");
        }
    }, [detectedText, hasRecognizedText, onSelect]);

    const handleGenerateSuggestions = async () => {
        if (!hasRecognizedText) {
            setSuggestions([]);
            setSelected("");
            setError("Please recognize a sign before generating suggestions.");
            onSelect?.("");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuggestions([]);
            setSelected("");
            onSelect?.("");

            const results = await generateSentenceSuggestions({
                detectedText,
                mode
            });

            setSuggestions(results || []);

            if (!results?.length) {
                setError("No suggestions found for the recognized sign.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to generate suggestions. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (sentence) => {
        setSelected(sentence);
        onSelect?.(sentence);
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:p-6">
            <h2 className="text-lg font-bold text-white">
                Sentence Suggestions
            </h2>

            <p className="mb-4 mt-1 text-sm text-slate-400">
                Choose a meaningful sentence based on your recognized signs.
            </p>

            <div className="mb-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-950">
    <p className="text-xs uppercase text-slate-600 dark:text-slate-400">
        Recognized Text
    </p>

    <p className="mt-1 text-sm text-slate-900 dark:text-white">
        {hasRecognizedText
            ? detectedText
            : "No signs recognized yet"}
    </p>
</div>

            <button
                type="button"
                onClick={handleGenerateSuggestions}
                disabled={!hasRecognizedText || loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
                {loading ? "Generating..." : "Generate Suggestions"}
            </button>

            {error && (
                <p className="mt-3 text-sm text-red-400" role="alert">
                    {error}
                </p>
            )}

            {suggestions.length > 0 && (
                <div className="mt-5 space-y-3">
                    <h3 className="font-semibold text-white">
                        Select a sentence
                    </h3>

                    {suggestions.map((sentence, index) => (
                        <button
                            type="button"
                            key={`${sentence}-${index}`}
                            onClick={() => handleSelect(sentence)}
                            className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
    selected === sentence
        ? "border-indigo-500 bg-indigo-50 text-slate-900 dark:bg-indigo-950 dark:text-white"
        : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
}`}
                        >
                            <span
    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full
    bg-indigo-100 text-indigo-700
    dark:bg-indigo-900 dark:text-indigo-200
    text-xs font-semibold"
>
    {index + 1}
</span>

                            <span className="flex-1">{sentence}</span>

                            {selected === sentence && (
                                <span aria-label="Selected">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SentenceSuggestions;