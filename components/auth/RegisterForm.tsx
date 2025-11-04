"use client";

import { useState } from "react";

interface RegisterFormProps {
  onSubmit: (username: string, password: string, email?: string) => Promise<void>;
  onSwitchToLogin: () => void;
  error: string | null;
  isLoading?: boolean;
}

export function RegisterForm({ onSubmit, onSwitchToLogin, error, isLoading = false }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validation
    if (password !== confirmPassword) {
      setValidationError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setValidationError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (username.length < 3) {
      setValidationError("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }

    await onSubmit(username, password, email || undefined);
  };

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-sm font-semibold text-mii-ink">
          Nom d'utilisateur <span className="text-red-500">*</span>
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d'utilisateur"
          required
          minLength={3}
          className="rounded-2xl border-2 border-mii-silver bg-white px-4 py-3 text-base text-mii-ink placeholder-mii-slate/50 transition-all duration-200 focus:border-mii-sky-400 focus:outline-none focus:ring-4 focus:ring-mii-sky-400/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-mii-ink">
          Email <span className="text-mii-slate/60 text-xs">(optionnel)</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          className="rounded-2xl border-2 border-mii-silver bg-white px-4 py-3 text-base text-mii-ink placeholder-mii-slate/50 transition-all duration-200 focus:border-mii-sky-400 focus:outline-none focus:ring-4 focus:ring-mii-sky-400/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-semibold text-mii-ink">
          Mot de passe <span className="text-red-500">*</span>
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

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className="text-sm font-semibold text-mii-ink">
          Confirmer le mot de passe <span className="text-red-500">*</span>
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          className="rounded-2xl border-2 border-mii-silver bg-white px-4 py-3 text-base text-mii-ink placeholder-mii-slate/50 transition-all duration-200 focus:border-mii-sky-400 focus:outline-none focus:ring-4 focus:ring-mii-sky-400/20"
        />
      </div>

      {displayError && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {displayError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-green-600 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Inscription..." : "S'inscrire"}
      </button>

      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-sm text-mii-slate hover:text-mii-ink transition-colors"
      >
        Déjà un compte ? <span className="font-semibold">Se connecter</span>
      </button>
    </form>
  );
}
