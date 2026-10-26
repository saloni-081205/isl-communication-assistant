import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import { Moon,Sun } from 'lucide-react';

const DashboardNavbar = () => {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();

        toast.success("Logged out successfully");

        navigate("/login");
    };

    const fullName =
        user?.firstName || user?.lastName
            ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
            : "User";

    return (
        <nav
            className="
                sticky top-0 z-50
                border-b
                border-slate-200/80
                bg-white/80
                shadow-sm
                backdrop-blur-xl
                transition-colors
                dark:border-slate-800
                dark:bg-slate-950/85
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    h-18
                    min-h-[72px]
                    max-w-7xl
                    items-center
                    justify-between
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >

                {/* Logo */}
                <Link
                    to="/dashboard"
                    className="group flex items-center gap-3"
                >
                    <div className="flex h-13 w-13 items-center justify-center">
                        <img
                            src={logo}
                            alt="Clarify ISL"
                            className="transition group-hover:scale-105"
                        />
                    </div>

                    <div>
                        <h1
                            className="
                                bg-gradient-to-r
                                from-blue-600
                                to-cyan-500
                                bg-clip-text
                                text-xl
                                font-extrabold
                                text-transparent
                            "
                        >
                            Clarify ISL
                        </h1>

                        <p className="hidden text-[10px] text-gray-400 dark:text-slate-200 sm:block">
                            AI Communication Assistant
                        </p>
                    </div>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-2 sm:gap-4">

                    {/* Dashboard */}
                    <Link
                        to="/dashboard"
                        className="
                            hidden
                            rounded-lg
                            bg-blue-50
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-blue-600
                            transition
                            dark:bg-blue-500/10
                            dark:text-blue-400
                            sm:block
                        "
                    >
                        Dashboard
                    </Link>

                    {/* History
                    <Link
                        to="/history"
                        className="
                            hidden
                            sm:block
                            text-sm
                            font-medium
                            text-gray-600
                            dark:text-slate-300
                            hover:text-blue-600
                            dark:hover:text-blue-400
                            transition
                        "
                    >
                        History
                    </Link> */}

                    {/* Profile
                    <Link
                        to="/profile"
                        className="
                            hidden
                            text-sm
                            font-medium
                            text-gray-600
                            transition
                            hover:text-blue-600
                            dark:text-slate-300
                            dark:hover:text-blue-400
                            sm:block
                        "
                    >
                        Profile
                    </Link> */}

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
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            text-slate-600
                            transition
                            hover:bg-slate-50
                            hover:text-blue-600
                            dark:border-slate-700
                            dark:bg-slate-900
                            dark:text-slate-300
                            dark:hover:bg-slate-800
                            dark:hover:text-blue-400
                        "
                    >
                        {darkMode ? (
                            <span className="text-lg"><Sun /></span>
                        ) : (
                            <span className="text-lg"><Moon /></span>
                        )}
                    </button>

                    {/* User */}
                    <div className="hidden items-center gap-2 md:flex">

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-gradient-to-br
                                from-blue-500
                                to-indigo-500
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            {fullName.charAt(0).toUpperCase()}
                        </div>

                        <span
                            className="
                                text-sm
                                font-medium
                                text-gray-700
                                dark:text-slate-200
                            "
                        >
                            {fullName}
                        </span>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="
                            rounded-xl
                            bg-red-50
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-red-600
                            transition
                            hover:bg-red-100
                            dark:bg-red-500/10
                            dark:text-red-400
                            dark:hover:bg-red-500/20
                        "
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;