import Image from "next/image";
import { CheckIcon } from "@/components/achievements/CheckIcon";
import { AchievementStatus } from "@/components/achievements/AchievementStatus";
import { useAchievementAnimation } from "@/hooks/useAchievementAnimation";
import type { Achievement } from "@/types/achievement";

interface AchievementCardProps {
  achievement: Achievement;
  isCompleted: boolean;
  isHydrated: boolean;
  onToggle: (id: Achievement["id"]) => void;
  readOnly?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

const getCardClasses = (
  isCompleted: boolean,
  isHydrated: boolean,
  showAnimation: boolean,
  readOnly: boolean,
  disabled: boolean,
  isLoading: boolean
) => {
  const baseClasses =
    "group relative flex h-full min-h-40 items-stretch gap-4 overflow-hidden rounded-[26px] border-[3px] border-mii-silver bg-white/95 px-6 py-6 text-left shadow-[7px_7px_0_rgba(18,38,58,0.12)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-mii-lime/70";

  const interactionClasses = readOnly || disabled
    ? "cursor-default"
    : "active:translate-y-0.5";

  const disabledClasses = disabled && !isLoading
    ? "opacity-50 pointer-events-none"
    : "";

  const loadingClasses = isLoading
    ? "animate-pulse cursor-wait"
    : "";

  const stateClasses =
    isCompleted && isHydrated && showAnimation
      ? "border-mii-lime/70 bg-mii-lime/20 animate-achievement-pop"
      : isCompleted
      ? "border-mii-lime/70 bg-mii-lime/20"
      : !readOnly && !disabled
      ? "hover:-translate-y-1"
      : "";

  return `${baseClasses} ${interactionClasses} ${disabledClasses} ${loadingClasses} ${stateClasses}`;
};

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isCompleted,
  isHydrated,
  onToggle,
  readOnly = false,
  isLoading = false,
  disabled = false,
}) => {
  const { id, title, description, icon } = achievement;
  const { showAnimation, buttonRef } = useAchievementAnimation({
    isCompleted,
    isHydrated,
  });

  const handleClick = () => {
    if (!readOnly && !disabled && !isLoading) {
      onToggle(id);
    }
  };

  const statusLabel = isCompleted ? "VALIDE" : "NON VALIDE";

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      disabled={readOnly || disabled || isLoading}
      className={getCardClasses(isCompleted, isHydrated, showAnimation, readOnly, disabled, isLoading)}
      aria-pressed={isCompleted}
      aria-label={`${title} — ${statusLabel}`}
    >
      <CheckIcon isCompleted={isCompleted} showAnimation={showAnimation} />

      <div className="flex w-20 shrink-0 items-center justify-center self-stretch">
        <span className="relative flex h-full w-full items-center justify-center rounded-[20px] border-[3px] border-mii-silver bg-mii-sky-100">
          <Image
            src={icon}
            alt=""
            width={64}
            height={64}
            className="h-full w-full max-w-[60px] object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            aria-hidden
          />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 pr-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-mii-ink">{title}</h2>
          <p className="text-sm text-mii-slate">{description}</p>
        </div>
        <AchievementStatus isCompleted={isCompleted} />
      </div>
    </button>
  );
};
