import {
  FaCamera,
  FaLanguage,
  FaRobot,
  FaVolumeUp,
} from "react-icons/fa";

import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: <FaCamera />,
    title: "Real-Time ISL Detection",
    description:
      "Recognizes Indian Sign Language gestures instantly using AI-powered computer vision with MediaPipe and TensorFlow.",

    bgColor: "bg-blue-600",
  },

  {
    icon: <FaLanguage />,
    title: "Multilingual Translation",

    description:
      "Translate detected signs into English, Hindi, and Gujarati for better communication.",

    bgColor: "bg-green-500",
  },

  {
    icon: <FaRobot />,
    title: "AI Sentence Generation",

    description:
      "Generate meaningful and grammatically correct sentences from detected ISL words using contextual AI.",

    bgColor: "bg-purple-600",
  },

  {
    icon: <FaVolumeUp />,
    title: "Text-To-Speech",

    description:
      "Speak translated sentences aloud to bridge communication between deaf and hearing individuals.",

    bgColor: "bg-orange-500",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="
        py-24
        bg-gray-50
        dark:bg-slate-950
        transition-colors
        duration-300
      "
    >

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2
            className="
              text-5xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            Powerful Features
          </h2>

          <p
            className="
              text-gray-600
              dark:text-slate-400
              mt-5
              text-lg
              max-w-3xl
              mx-auto
            "
          >
            Everything required for an intelligent,
            accessible,
            and AI-powered communication platform.
          </p>

        </div>

        <div
          className="
            grid
            md:grid-cols-2
            lg:grid-cols-4
            gap-8
          "
        >

          {features.map((feature, index) => (

            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              bgColor={feature.bgColor}
            />

          ))}

        </div>

      </div>

    </section>
  );
};

export default Features;