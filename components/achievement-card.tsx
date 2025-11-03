import Image from "next/image";
import type { Achievement } from "@/types/achievement";

interface AchievementCardProps {
  achievement: Achievement;
  isCompleted: boolean;
  isHydrated: boolean;
  onToggle: (id: Achievement["id"]) => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isCompleted,
  isHydrated,
  onToggle,
}) => {
  const { id, title, description, icon } = achievement;

  const handleClick = () => {
    onToggle(id);
  };

  const statusLabel = isCompleted ? "VALIDE" : "NON VALIDE";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group relative flex h-full min-h-40 items-stretch gap-4 overflow-hidden rounded-[26px] border-[3px] border-mii-silver bg-white/95 px-6 py-6 text-left shadow-[7px_7px_0_rgba(18,38,58,0.12)] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-mii-lime/70 active:translate-y-0.5 ${
        isCompleted && isHydrated
          ? "border-mii-lime/70 bg-mii-lime/20 animate-achievement-pop"
          : "hover:-translate-y-1"
      }`}
      aria-pressed={isCompleted}
      aria-label={`${title} — ${statusLabel}`}
    >
      <span className="absolute right-5 top-5 inline-flex items-center justify-center rounded-full border-[3px] shadow-[3px_3px_0_rgba(18,38,58,0.15)] transition-all duration-200 group-hover:scale-110">
        <span
          className={`grid size-9 place-items-center rounded-full font-bold text-lg transition-all ${
            isCompleted
              ? "bg-green-500 text-white border-green-600 shadow-lg"
              : "bg-white text-mii-slate border-mii-silver/50"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        {isCompleted ? (
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-full border border-green-400/40">
            <span className="pointer-events-none absolute inset-0 -z-10 animate-ripple-check rounded-full border border-green-500/60" />
          </span>
        ) : null}
      </span>
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
        <span
          className={`mt-auto inline-flex items-center justify-center rounded-[14px] border-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${
            isCompleted
              ? "border-mii-lime/80 bg-mii-lime/20 text-mii-ink"
              : "border-mii-silver bg-white text-mii-slate"
          }`}
        >
          {statusLabel}
        </span>
      </div>
    </button>
  );
};
