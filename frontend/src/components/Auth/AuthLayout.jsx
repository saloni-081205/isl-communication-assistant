import logo from "../../assets/logo.png";
import { useTheme } from "../../context/ThemeContext";
import {Sun,Moon} from 'lucide-react';

const AuthLayout = ({ children }) => {

    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <div
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-gradient-to-br
                from-blue-50
                via-white
                to-cyan-100
                transition-colors
                dark:from-slate-950
                dark:via-slate-900
                dark:to-blue-950
            "
        >

            {/* Theme Toggle */}
            <button
                type="button"
                onClick={toggleDarkMode}
                title={
                    darkMode
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                }
                aria-label={
                    darkMode
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                }
                className="
                    absolute
                    right-5
                    top-5
                    z-50
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/70
                    bg-white/70
                    text-lg
                    shadow-lg
                    backdrop-blur-xl
                    transition
                    hover:scale-105

                    dark:border-slate-700
                    dark:bg-slate-900/80
                    dark:text-slate-200
                "
            >
                {darkMode ? <Sun/> : <Moon />}
            </button>


            {/* Background Decorative Blurs */}

            <div
                className="
                    absolute
                    -left-32
                    -top-32
                    h-96
                    w-96
                    rounded-full
                    bg-blue-400/30
                    blur-3xl
                    dark:bg-blue-600/20
                "
            />

            <div
                className="
                    absolute
                    -right-32
                    top-1/3
                    h-96
                    w-96
                    rounded-full
                    bg-cyan-400/30
                    blur-3xl
                    dark:bg-cyan-500/10
                "
            />

            <div
                className="
                    absolute
                    -bottom-40
                    left-1/3
                    h-96
                    w-96
                    rounded-full
                    bg-indigo-400/20
                    blur-3xl
                    dark:bg-indigo-600/10
                "
            />


            <div className="relative grid min-h-screen lg:grid-cols-2">

                {/* ================= LEFT SIDE ================= */}

                <div
                    className="
                        hidden
                        items-center
                        justify-center
                        p-12
                        lg:flex
                    "
                >

                    <div className="max-w-xl text-center">

                        {/* Logo */}
                        <div className="mb-8 flex justify-center">

                            <div
                                className="
                                    rounded-3xl
                                    border
                                    border-white/60
                                    bg-white/50
                                    p-5
                                    shadow-2xl
                                    backdrop-blur-xl
                                    dark:border-slate-700/60
                                    dark:bg-slate-900/50
                                "
                            >

                                <img
                                    src={logo}
                                    alt="Clarify ISL Logo"
                                    className="h-28 w-28 object-contain"
                                />

                            </div>

                        </div>


                        {/* Brand */}
                        <h1
                            className="
                                bg-gradient-to-r
                                from-blue-700
                                via-indigo-600
                                to-cyan-500
                                bg-clip-text
                                text-6xl
                                font-extrabold
                                tracking-tight
                                text-transparent
                            "
                        >
                            Clarify ISL
                        </h1>


                        {/* Tagline */}
                        <p
                            className="
                                mt-6
                                text-xl
                                font-medium
                                leading-8
                                text-gray-600
                                dark:text-slate-300
                            "
                        >
                            AI-Powered Indian Sign Language
                            <br />
                            Communication Assistant
                        </p>


                        {/* Feature Pills */}
                        <div className="mt-8 flex flex-wrap justify-center gap-3">

                            <span
                                className="
                                    rounded-full
                                    border
                                    border-white/70
                                    bg-white/60
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-blue-700
                                    shadow-sm
                                    backdrop-blur-md

                                    dark:border-blue-500/20
                                    dark:bg-blue-500/10
                                    dark:text-blue-400
                                "
                            >
                                Real-Time ISL
                            </span>

                            <span
                                className="
                                    rounded-full
                                    border
                                    border-white/70
                                    bg-white/60
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-indigo-700
                                    shadow-sm
                                    backdrop-blur-md

                                    dark:border-indigo-500/20
                                    dark:bg-indigo-500/10
                                    dark:text-indigo-400
                                "
                            >
                                Multilingual
                            </span>

                            <span
                                className="
                                    rounded-full
                                    border
                                    border-white/70
                                    bg-white/60
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-cyan-700
                                    shadow-sm
                                    backdrop-blur-md

                                    dark:border-cyan-500/20
                                    dark:bg-cyan-500/10
                                    dark:text-cyan-400
                                "
                            >
                                Text-to-Speech
                            </span>

                        </div>


                        <p
                            className="
                                mt-10
                                text-sm
                                text-gray-500
                                dark:text-slate-500
                            "
                        >
                            Making communication more accessible,
                            one sign at a time.
                        </p>

                    </div>

                </div>


                {/* ================= RIGHT SIDE ================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-center
                        px-5
                        py-10
                        sm:px-8
                    "
                >

                    <div className="w-full max-w-md">

                        {children}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AuthLayout;