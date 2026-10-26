import { useState } from "react";
import { Settings} from 'lucide-react';

const ControlPanel = () => {
  const [context, setContext] = useState("General");
  const [language, setLanguage] = useState("English");

  return (
    <div className="bg-white/75 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl p-6">

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

        <div>

          <div className="flex items-center gap-2">

            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
              <Settings />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              Conversation Settings
            </h2>

          </div>

          <p className="text-sm text-gray-500 mt-2">
            Choose the context and language for your conversation.
          </p>

        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-5">

        {/* Context */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conversation Context
          </label>

          <select
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full border border-gray-200 bg-white/70 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          >

            <option value="General">
              General
            </option>

            <option value="Home">
              Home
            </option>

            <option value="Restaurant">
              Restaurant
            </option>

            <option value="Education">
              Education
            </option>

          </select>

        </div>

        {/* Language */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Language
          </label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-200 bg-white/70 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          >

            <option value="English">
              🇬🇧 English
            </option>

            <option value="Hindi">
              🇮🇳 Hindi
            </option>

            <option value="Gujarati">
              🇮🇳 Gujarati
            </option>

          </select>

        </div>

        {/* Generate */}

        <div className="flex items-end">

          <button
            className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            Generate Sentence
          </button>

        </div>

      </div>

    </div>
  );
};

export default ControlPanel;

