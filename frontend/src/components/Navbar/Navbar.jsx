import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaMoon, FaSun } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav
      className="
        fixed
        top-0
        left-0
        w-full
        z-50
        bg-white/90
        dark:bg-slate-950/90
        backdrop-blur-md
        shadow-sm
        dark:shadow-slate-900/50
        border-b
        border-transparent
        dark:border-slate-800
        transition-colors
        duration-300
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          flex
          items-center
          justify-between
          px-6
          py-4
        "
      >

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >

          <img
            src={logo}
            alt="Clarify ISL"
            className="h-12"
          />

          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-blue-600
                dark:text-blue-400
                transition-colors
              "
            >
              Clarify ISL
            </h1>

            <p
              className="
                text-sm
                text-gray-700
                dark:text-slate-400
                transition-colors
              "
            >
              AI-Powered Sign Language Assistant
            </p>

          </div>

        </Link>

        {/* Desktop Menu */}

        <div className="hidden md:flex items-center gap-8">

          <a
            href="#features"
            className="
              text-gray-700
              dark:text-slate-300
              hover:text-blue-600
              dark:hover:text-blue-400
              transition
            "
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="
              text-gray-700
              dark:text-slate-300
              hover:text-blue-600
              dark:hover:text-blue-400
              transition
            "
          >
            How It Works
          </a>

          <Link
            to="/login"
            className="
              text-blue-600
              dark:text-blue-400
              font-semibold
              hover:text-blue-700
              dark:hover:text-blue-300
              transition
            "
          >
            Login
          </Link>

          {/* Theme Toggle */}

          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              bg-slate-100
              dark:bg-slate-800
              text-slate-700
              dark:text-yellow-300
              hover:bg-slate-200
              dark:hover:bg-slate-700
              transition
            "
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <Link
            to="/register"
            className="
              bg-blue-600
              hover:bg-blue-700
              dark:bg-blue-500
              dark:hover:bg-blue-600
              transition
              text-white
              px-5
              py-2
              rounded-full
              font-medium
            "
          >
            Get Started
          </Link>

        </div>

        {/* Mobile Controls */}

        <div className="md:hidden flex items-center gap-3">

          {/* Theme Toggle */}

          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              bg-slate-100
              dark:bg-slate-800
              text-slate-700
              dark:text-yellow-300
              transition
            "
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              text-3xl
              text-gray-700
              dark:text-slate-200
              transition
            "
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}

      {menuOpen && (

        <div
          className="
            md:hidden
            bg-white
            dark:bg-slate-950
            border-t
            border-gray-100
            dark:border-slate-800
            shadow-lg
            dark:shadow-slate-950/50
          "
        >

          <div className="flex flex-col p-5 space-y-5">

            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="
                text-gray-700
                dark:text-slate-300
                hover:text-blue-600
                dark:hover:text-blue-400
                transition
              "
            >
              Features
            </a>

            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="
                text-gray-700
                dark:text-slate-300
                hover:text-blue-600
                dark:hover:text-blue-400
                transition
              "
            >
              How It Works
            </a>

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="
                text-gray-700
                dark:text-slate-300
                hover:text-blue-600
                dark:hover:text-blue-400
                transition
              "
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="
                bg-blue-600
                dark:bg-blue-500
                text-white
                py-3
                rounded-full
                text-center
                hover:bg-blue-700
                dark:hover:bg-blue-600
                transition
              "
            >
              Get Started
            </Link>

          </div>

        </div>

      )}

    </nav>
  );
};

export default Navbar;