import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaReact,
  FaNodeJs,
  FaPython,
  FaDatabase,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-300">

      {/* Main Footer */}

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-4 md:grid-cols-2 gap-10">

        {/* Project */}

        <div>

          <h2 className="text-3xl font-bold text-white">

            Clarify ISL

          </h2>

          <p className="mt-5 leading-7">

            AI-Powered Indian Sign Language Communication Assistant
            designed to bridge the communication gap between deaf
            and hearing communities using Artificial Intelligence.

          </p>

        </div>

        {/* Quick Links */}

        <div>

          <h3 className="text-xl font-semibold text-white mb-5">

            Quick Links

          </h3>

          <div className="flex flex-col gap-3">

            <a href="#features" className="hover:text-blue-400">
              Features
            </a>

            <a href="#how-it-works" className="hover:text-blue-400">
              How It Works
            </a>

            <Link to="/login" className="hover:text-blue-400">
              Login
            </Link>

            <Link to="/register" className="hover:text-blue-400">
              Register
            </Link>

          </div>

        </div>

        {/* Technology */}

        <div>

          <h3 className="text-xl font-semibold text-white mb-5">

            Technology Stack

          </h3>

          <div className="space-y-3">

            <div className="flex items-center gap-3">
              <FaReact className="text-cyan-400" />
              React + Vite
            </div>

            <div className="flex items-center gap-3">
              <FaNodeJs className="text-green-500" />
              Node.js + Express
            </div>

            <div className="flex items-center gap-3">
              <FaPython className="text-yellow-400" />
              FastAPI + TensorFlow
            </div>

            <div className="flex items-center gap-3">
              <FaDatabase className="text-blue-400" />
              MySQL Database
            </div>

          </div>

        </div>

        {/* Contact */}

        <div>

          <h3 className="text-xl font-semibold text-white mb-5">

            Connect

          </h3>

          <div className="space-y-4">

            <a
              href="#"
              className="flex items-center gap-3 hover:text-blue-400"
            >
              <FaGithub />
              GitHub
            </a>

            <a
              href="#"
              className="flex items-center gap-3 hover:text-blue-400"
            >
              <FaLinkedin />
              LinkedIn
            </a>

            <a
              href="mailto:your@email.com"
              className="flex items-center gap-3 hover:text-blue-400"
            >
              <FaEnvelope />
              Email
            </a>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-slate-700">

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">

          <p>

            © {year} Clarify ISL. All Rights Reserved.

          </p>

          <p className="mt-3 md:mt-0">

            Built using ❤️ React • Express • FastAPI • TensorFlow

          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;