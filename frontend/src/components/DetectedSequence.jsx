import React from "react";

const DetectedSequence = ({
    sequence,
    onSpace,
    onDelete,
    onClear,
}) => {
    return (
        <div
            className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                transition-colors
                dark:border-slate-800
                dark:bg-slate-900
                sm:p-5
            "
        >

            {/* Header */}
            <div className="mb-4 flex items-center justify-between gap-3">

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
                        Detected Sequence
                    </h2>

                    <p
                        className="
                            mt-1
                            text-[11px]
                            text-slate-500
                            dark:text-slate-400
                            sm:text-xs
                        "
                    >
                        Your detected signs appear here in order
                    </p>
                </div>

                {sequence.length > 0 && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="
                            shrink-0
                            rounded-lg
                            px-2.5
                            py-1.5
                            text-xs
                            font-medium
                            text-red-500
                            transition
                            hover:bg-red-50
                            dark:text-red-400
                            dark:hover:bg-red-500/10
                        "
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Sequence */}
            <div
                className="
                    min-h-[110px]
                    rounded-xl
                    border
                    border-slate-100
                    bg-slate-50
                    p-3
                    transition-colors
                    dark:border-slate-800
                    dark:bg-slate-950
                    sm:min-h-[125px]
                    sm:p-4
                "
            >
                {sequence.length === 0 ? (

                    <div className="flex h-full min-h-[80px] items-center justify-center text-center">

                        <div>

                            <div className="mb-2 text-2xl">
                                🤟
                            </div>

                            <p
                                className="
                                    text-xs
                                    font-medium
                                    text-slate-500
                                    dark:text-slate-400
                                    sm:text-sm
                                "
                            >
                                Start signing to build your message
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
                                Detected signs will appear here
                            </p>

                        </div>

                    </div>

                ) : (

                    <div
                        className="
                            flex
                            max-h-[190px]
                            flex-wrap
                            items-center
                            gap-y-3
                            overflow-y-auto
                        "
                    >

                        {sequence.map((item, index) => {

                            const isSpace = item === " ";

                            return (
                                <React.Fragment
                                    key={`${item}-${index}`}
                                >

                                    {/* Arrow */}
                                    {index > 0 && (
                                        <span
                                            className="
                                                mx-1
                                                text-xs
                                                text-slate-300
                                                dark:text-slate-600
                                                sm:mx-1.5
                                            "
                                        >
                                            →
                                        </span>
                                    )}

                                    {/* Token */}
                                    <div
                                        className={`
                                            flex
                                            h-9
                                            min-w-9
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                            px-2.5
                                            text-sm
                                            font-bold
                                            transition
                                            sm:h-10
                                            sm:min-w-10
                                            sm:px-3
                                            sm:text-base

                                            ${
                                                isSpace
                                                    ? `
                                                        border-dashed
                                                        border-slate-300
                                                        bg-white
                                                        text-slate-300
                                                        dark:border-slate-700
                                                        dark:bg-slate-900
                                                        dark:text-slate-600
                                                    `
                                                    : `
                                                        border-blue-100
                                                        bg-blue-50
                                                        text-blue-700
                                                        dark:border-blue-500/20
                                                        dark:bg-blue-500/10
                                                        dark:text-blue-400
                                                    `
                                            }
                                        `}
                                    >
                                        {isSpace ? "␣" : item}
                                    </div>

                                </React.Fragment>
                            );
                        })}

                    </div>
                )}
            </div>

            {/* Current sequence text */}
            <div
                className="
                    mt-3
                    rounded-xl
                    bg-slate-50
                    px-3
                    py-2.5
                    transition-colors
                    dark:bg-slate-950
                    sm:px-4
                    sm:py-3
                "
            >

                <p
                    className="
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-wide
                        text-slate-400
                        dark:text-slate-500
                    "
                >
                    Current Message
                </p>

                <p
                    className="
                        mt-1
                        break-words
                        text-sm
                        font-semibold
                        text-slate-700
                        dark:text-slate-200
                        sm:text-base
                    "
                >
                    {sequence.length > 0
                        ? sequence.join("")
                        : "—"}
                </p>

            </div>

            {/* Controls */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">

                <button
                    type="button"
                    onClick={onSpace}
                    className="
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-slate-600
                        transition
                        hover:bg-slate-50
                        dark:border-slate-700
                        dark:bg-slate-900
                        dark:text-slate-300
                        dark:hover:bg-slate-800
                        sm:px-4
                        sm:text-sm
                    "
                >
                    Space
                </button>

                <button
                    type="button"
                    onClick={onDelete}
                    disabled={sequence.length === 0}
                    className="
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-slate-600
                        transition
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        dark:border-slate-700
                        dark:bg-slate-900
                        dark:text-slate-300
                        dark:hover:bg-slate-800
                        sm:px-4
                        sm:text-sm
                    "
                >
                    Delete
                </button>

            </div>

        </div>
    );
};

export default DetectedSequence;