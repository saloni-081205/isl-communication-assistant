
const DetectionResult = () => {
  const confidence = 98.7;

  return (
    <div className="bg-white/75 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl overflow-hidden">

      {/* Header */}

      <div className="px-5 py-5 border-b border-gray-100">

        <div className="flex items-center gap-3">

          {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white">
            ✨
          </div> */}

          <div>

            <h2 className="font-bold text-gray-900">
              AI Detection
            </h2>

            <p className="text-xs text-gray-500">
              Latest prediction
            </p>

          </div>

        </div>

      </div>

      <div className="p-5">

        {/* Detection Status */}

        <div className="flex items-center gap-2 mb-5">

          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />

          <span className="text-xs font-semibold text-green-600">
            HIGH CONFIDENCE
          </span>

        </div>

        {/* Detected Word */}

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-5 text-center">

          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Detected Word
          </p>

          <h2 className="text-4xl font-extrabold text-blue-600 mt-3">
            Hello
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            Indian Sign Language
          </p>

        </div>

        {/* Confidence */}

        <div className="mt-6">

          <div className="flex justify-between items-center mb-2">

            <span className="text-sm text-gray-600">
              Confidence
            </span>

            <span className="text-sm font-bold text-gray-900">
              {confidence}%
            </span>

          </div>

          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">

            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
              style={{ width: `${confidence}%` }}
            />

          </div>

        </div>

        {/* AI Info */}

        <div className="mt-6 space-y-3">

          <div className="flex items-center justify-between text-sm">

            <span className="text-gray-500">
              Model
            </span>

            <span className="font-medium text-gray-700">
              ISL AI
            </span>

          </div>

          <div className="flex items-center justify-between text-sm">

            <span className="text-gray-500">
              Status
            </span>

            <span className="text-green-600 font-medium">
              Ready
            </span>

          </div>

        </div>

        {/* Tip */}

        <div className="mt-6 p-3 rounded-xl bg-indigo-50 border border-indigo-100">

          <p className="text-xs text-indigo-700 leading-5">
            💡 Keep your hand inside the camera frame
            for more accurate predictions.
          </p>

        </div>

      </div>

    </div>
  );
};

export default DetectionResult;

