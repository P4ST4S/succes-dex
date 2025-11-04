"use client";

import { useState } from "react";
import { UserAuthModal } from "./auth/UserAuthModal";
import { useUser } from "@/hooks/useUser";

export function AuthButtons() {
  const { user, isLoading, logout } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "register">("login");

  const handleOpenLogin = () => {
    setModalMode("login");
    setIsModalOpen(true);
  };

  const handleOpenRegister = () => {
    setModalMode("register");
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-24 animate-pulse rounded-full bg-white/20" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-mii ring-1 ring-mii-silver/70">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-mii-ink">
            {user.username}
          </span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-mii-slate shadow-mii ring-1 ring-mii-silver/70 transition-all duration-200 hover:bg-white hover:text-mii-ink hover:ring-mii-silver"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleOpenLogin}
          className="flex min-w-32 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-cyan-600 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 shrink-0"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Connexion
        </button>
        <button
          type="button"
          onClick={handleOpenRegister}
          className="flex min-w-32 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-green-600 hover:to-emerald-600 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 shrink-0"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          Inscription
        </button>
      </div>

      <UserAuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultMode={modalMode}
      />
    </>
  );
}
