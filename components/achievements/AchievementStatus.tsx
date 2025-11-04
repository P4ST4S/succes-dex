interface AchievementStatusProps {
  isCompleted: boolean;
}

export const AchievementStatus: React.FC<AchievementStatusProps> = ({
  isCompleted,
}) => {
  const statusLabel = isCompleted ? "VALIDE" : "NON VALIDE";

  return (
    <span
      className={`mt-auto inline-flex items-center justify-center rounded-[14px] border-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${
        isCompleted
          ? "border-mii-lime/80 bg-mii-lime/20 text-mii-ink"
          : "border-mii-silver bg-white text-mii-slate"
      }`}
    >
      {statusLabel}
    </span>
  );
};
