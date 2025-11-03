import { AchievementsGrid } from "@/components/achievements-grid";
import type { Achievement } from "@/types/achievement";
import successes from "@/public/successes.json";

const achievements = successes as Achievement[];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-4 pb-16 pt-24 sm:px-8 lg:px-12">
      <section className="flex flex-col gap-4 text-left sm:gap-5">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-mii-slate shadow-mii backdrop-blur-gloss ring-1 ring-mii-silver/70">
          <span className="size-2 rounded-full bg-mii-sky-400" aria-hidden />
          Challenge run
        </span>
        <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-mii-ink sm:text-5xl">
          Succes Pokemon Heartgold & Soulsilver
        </h1>
        <p className="max-w-2xl text-pretty text-base text-mii-slate sm:text-lg">
          Coche chaque etape iconique inspiree de Pokemon Heartgold & Soulsilver. Appuie sur une carte pour valider un succes et garde ta progression
          sauvegardee localement.
        </p>
      </section>
      <AchievementsGrid achievements={achievements} />
    </main>
  );
}
