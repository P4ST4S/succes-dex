interface CheckIconProps {
  isCompleted: boolean;
  showAnimation: boolean;
}

export const CheckIcon: React.FC<CheckIconProps> = ({
  isCompleted,
  showAnimation,
}) => {
  return (
    <span className="absolute right-5 top-5 inline-flex items-center justify-center rounded-full border-[3px] shadow-[3px_3px_0_rgba(18,38,58,0.15)] transition-all duration-200 group-hover:scale-110 overflow-visible">
      <span
        className={`relative grid size-9 place-items-center rounded-full font-bold text-lg transition-all duration-300 overflow-hidden ${
          isCompleted
            ? "bg-green-500 text-white border-green-600 shadow-lg"
            : "bg-white text-mii-slate border-mii-silver/50"
        } ${showAnimation ? "animate-pulse-glow" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-5 h-5 transition-all duration-300 ${showAnimation ? "animate-check-bounce" : ""}`}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>

        {showAnimation ? (
          <>
            <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent animate-shine" />
            <span
              className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/20 to-transparent animate-shine"
              style={{ animationDelay: "100ms" }}
            />
          </>
        ) : null}
      </span>

      {isCompleted && showAnimation ? (
        <>
          <span className="pointer-events-none absolute inset-0 -z-10 animate-ripple-check rounded-full border-2 border-green-400/80" />
          <span
            className="pointer-events-none absolute inset-0 -z-10 animate-ripple-check rounded-full border-2 border-green-300/60"
            style={{ animationDelay: "150ms" }}
          />
        </>
      ) : null}
    </span>
  );
};
