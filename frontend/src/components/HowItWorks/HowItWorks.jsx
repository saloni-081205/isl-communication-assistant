import {
  FaCamera,
  FaHandPaper,
  FaBrain,
  FaLanguage,
  FaVolumeUp,
  FaHistory,
} from "react-icons/fa";

const steps = [
  {
    id: 1,
    icon: <FaCamera />,
    title: "Open Camera",
    description:
      "Allow webcam access to capture Indian Sign Language gestures.",
    color: "bg-blue-600",
  },

  {
    id: 2,
    icon: <FaHandPaper />,
    title: "Detect Signs",
    description:
      "MediaPipe detects hand landmarks from live video frames.",
    color: "bg-green-500",
  },

  {
    id: 3,
    icon: <FaBrain />,
    title: "AI Prediction",
    description:
      "TensorFlow model predicts the ISL word with confidence score.",
    color: "bg-purple-600",
  },

  {
    id: 4,
    icon: <FaLanguage />,
    title: "Generate & Translate",
    description:
      "Generate meaningful sentences and translate into multiple languages.",
    color: "bg-orange-500",
  },

  {
    id: 5,
    icon: <FaVolumeUp />,
    title: "Speak",
    description:
      "Convert translated text into natural speech using Text-to-Speech.",
    color: "bg-pink-600",
  },

  {
    id: 6,
    icon: <FaHistory />,
    title: "Save History",
    description:
      "Store conversations securely for future reference.",
    color: "bg-indigo-600",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="
        py-24
        bg-white
        dark:bg-slate-900
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
            How It Works
          </h2>

          <p
            className="
              text-lg
              text-gray-600
              dark:text-slate-400
              mt-5
              max-w-3xl
              mx-auto
            "
          >
            Our AI-powered communication assistant follows a
            simple six-step process to translate Indian Sign
            Language into meaningful speech and text.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {steps.map((step) => (

            <div
              key={step.id}
              className="
                relative
                bg-gray-50
                dark:bg-slate-800
                rounded-3xl
                p-8
                shadow
                dark:shadow-black/20
                hover:shadow-xl
                dark:hover:shadow-black/40
                transition
                duration-300
                border
                border-transparent
                dark:border-slate-700
              "
            >

              <div
                className={`
                  w-16
                  h-16
                  ${step.color}
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-white
                  text-3xl
                  mb-6
                `}
              >
                {step.icon}
              </div>

              <div
                className="
                  absolute
                  top-6
                  right-6
                  text-5xl
                  font-bold
                  text-gray-200
                  dark:text-slate-700
                "
              >
                {step.id}
              </div>

              <h3
                className="
                  text-2xl
                  font-bold
                  mb-3
                  text-slate-900
                  dark:text-white
                "
              >
                {step.title}
              </h3>

              <p
                className="
                  text-gray-600
                  dark:text-slate-400
                  leading-7
                "
              >
                {step.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default HowItWorks;