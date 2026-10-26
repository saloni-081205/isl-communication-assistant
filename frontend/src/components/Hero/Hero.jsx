import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaPlayCircle,
  FaCheckCircle,
} from "react-icons/fa";

const Hero = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-blue-50
        via-white
        to-blue-100
        dark:from-slate-950
        dark:via-slate-900
        dark:to-blue-950
        pt-36
        pb-24
        transition-colors
        duration-300
      "
    >

      {/* Background Blur Circles */}

      <div
        className="
          absolute
          -top-20
          -right-20
          w-96
          h-96
          bg-blue-300
          dark:bg-blue-600
          rounded-full
          blur-3xl
          opacity-20
        "
      />

      <div
        className="
          absolute
          bottom-0
          -left-20
          w-80
          h-80
          bg-cyan-300
          dark:bg-cyan-600
          rounded-full
          blur-3xl
          opacity-20
        "
      />

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          grid
          lg:grid-cols-2
          gap-16
          items-center
        "
      >

        {/* LEFT SIDE */}

        <div>

          {/* Badge */}

          <div
            className="
              inline-flex
              items-center
              bg-blue-100
              dark:bg-blue-950
              text-blue-700
              dark:text-blue-300
              px-4
              py-2
              rounded-full
              text-sm
              font-medium
              mb-6
              border
              border-transparent
              dark:border-blue-900
            "
          >
            Introducing Clarify ISL
          </div>

          {/* Heading */}

          <h1
            className="
              text-5xl
              lg:text-6xl
              font-extrabold
              leading-tight
              text-slate-900
              dark:text-white
            "
          >
            Break

            <span className="text-blue-600 dark:text-blue-400">
              {" "}Communication{" "}
            </span>

            Barriers with AI
          </h1>

          {/* Description */}

          <p
            className="
              text-lg
              text-gray-600
              dark:text-slate-300
              mt-6
              leading-8
              max-w-xl
            "
          >
            Empowering the Deaf and Hard-of-Hearing community using
            AI-powered Indian Sign Language recognition,
            multilingual translation,
            and intelligent speech generation.
          </p>

          {/* Buttons */}

          <div className="flex flex-wrap gap-5 mt-10">

            <Link
              to="/register"
              className="
                bg-blue-600
                hover:bg-blue-700
                dark:bg-blue-500
                dark:hover:bg-blue-600
                transition
                text-white
                px-8
                py-4
                rounded-full
                font-semibold
                flex
                items-center
                gap-2
              "
            >
              Get Started
              <FaArrowRight />
            </Link>

            {/* <button
              className="
                border
                border-gray-300
                dark:border-slate-700
                text-gray-700
                dark:text-slate-200
                hover:bg-gray-100
                dark:hover:bg-slate-800
                transition
                px-8
                py-4
                rounded-full
                flex
                items-center
                gap-2
              "
            >
              <FaPlayCircle />
              View Demo
            </button> */}

          </div>

          {/* Trusted */}

          <div className="mt-12 flex items-center gap-3">

            <FaCheckCircle className="text-green-500 text-2xl" />

            <span
              className="
                text-gray-600
                dark:text-slate-300
              "
            >
              Trusted for academic demonstrations and AI-assisted
              communication.
            </span>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="relative">

          <div
            className="
              bg-white
              dark:bg-slate-900
              rounded-3xl
              shadow-2xl
              dark:shadow-black/40
              p-6
              border
              border-transparent
              dark:border-slate-800
              transition-colors
            "
          >

            <img
              src="src/assets/hero_image.png"
              alt="Hero"
              className="rounded-2xl"
            />

            {/* Floating Card */}

            <div
              className="
                absolute
                bottom-8
                left-8
                bg-white
                dark:bg-slate-800
                shadow-lg
                dark:shadow-black/40
                rounded-2xl
                p-4
                border
                border-transparent
                dark:border-slate-700
              "
            >

              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-slate-400
                "
              >
                AI Detection
              </p>

              <h3
                className="
                  font-bold
                  text-blue-600
                  dark:text-blue-400
                "
              >
                Hello
              </h3>

              <p
                className="
                  text-gray-600
                  dark:text-slate-300
                "
              >
                Confidence: 98.7%
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;