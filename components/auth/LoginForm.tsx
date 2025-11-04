"use client";

import { useState } from "react";

interface LoginFormProps {
  onSubmit: (identifier: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
  error: string | null;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, onSwitchToRegister, error, isLoading = false }: LoginFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(identifier, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="identifier" className="text-sm font-semibold text-mii-ink">
          Nom d'utilisateur ou email
        </label>
        <input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="username ou email@example.com"
          required
          className="rounded-2xl border-2 border-mii-silver bg-white px-4 py-3 text-base text-mii-ink placeholder-mii-slate/50 transition-all duration-200 focus:border-mii-sky-400 focus:outline-none focus:ring-4 focus:ring-mii-sky-400/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-semibold text-mii-ink">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          className="rounded-2xl border-2 border-mii-silver bg-white px-4 py-3 text-base text-mii-ink placeholder-mii-slate/50 transition-all duration-200 focus:border-mii-sky-400 focus:outline-none focus:ring-4 focus:ring-mii-sky-400/20"
        />
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>

      <button
        type="button"
        onClick={onSwitchToRegister}
        className="text-sm text-mii-slate hover:text-mii-ink transition-colors"
      >
        Pas encore de compte ? <span className="font-semibold">S'inscrire</span>
      </button>
    </form>
  );
}
