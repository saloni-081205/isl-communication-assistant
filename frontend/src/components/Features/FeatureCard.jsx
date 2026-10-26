const FeatureCard = ({
  icon,
  title,
  description,
  bgColor,
}) => {
  return (
    <div
      className="
        bg-white
        dark:bg-slate-900
        rounded-3xl
        shadow-md
        dark:shadow-black/30
        hover:shadow-xl
        dark:hover:shadow-black/50
        transition-all
        duration-300
        p-8
        border
        border-gray-100
        dark:border-slate-800
        hover:-translate-y-2
      "
    >

      {/* Icon */}

      <div
        className={`
          w-16
          h-16
          ${bgColor}
          rounded-2xl
          flex
          items-center
          justify-center
          text-white
          text-3xl
          mb-6
        `}
      >
        {icon}
      </div>

      {/* Title */}

      <h3
        className="
          text-2xl
          font-bold
          mb-4
          text-slate-900
          dark:text-white
          transition-colors
        "
      >
        {title}
      </h3>

      {/* Description */}

      <p
        className="
          text-gray-600
          dark:text-slate-400
          leading-7
          transition-colors
        "
      >
        {description}
      </p>

    </div>
  );
};

export default FeatureCard;