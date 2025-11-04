"use client";

import { AchievementsGrid } from "@/components/achievements-grid";
import { AuthButtons } from "@/components/AuthButtons";
import type { Achievement } from "@/types/achievement";
import successes from "@/public/successes.json";

const achievements = successes as Achievement[];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-4 pb-16 pt-24 sm:px-8 lg:px-12">
      <section className="flex flex-col gap-4 text-left sm:gap-5">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-mii-slate shadow-mii backdrop-blur-gloss ring-1 ring-mii-silver/70">
            <span className="size-2 rounded-full bg-mii-sky-400" aria-hidden />
            Challenge run
          </span>
          <a
            href="/josplay"
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-red-600 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-white" />
            </span>
            Voir les SUCCES de Josplay
          </a>
        </div>
        <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-mii-ink sm:text-5xl">
          Succes Pokemon Heartgold & Soulsilver
        </h1>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-pretty text-base text-mii-slate sm:text-lg">
            Challenge run des succès créés par Josplay, pour Pokémon Heartgold & Soulsilver. Chaque succès peut être validé en respectant les conditions indiquées.
          </p>
          <AuthButtons />
        </div>
      </section>
      <AchievementsGrid achievements={achievements} />
    </main>
  );
}
