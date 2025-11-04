"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useUser } from "@/hooks/useUser";

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

export function UserAuthModal({ isOpen, onClose, defaultMode = "login" }: UserAuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, error } = useUser();

  // Update mode when defaultMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setIsSubmitting(false);
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleLogin = async (identifier: string, password: string) => {
    setIsSubmitting(true);
    try {
      await login(identifier, password);
      // Context handles state update globally, just close modal
      onClose();
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (username: string, password: string, email?: string) => {
    setIsSubmitting(true);
    try {
      await register(username, password, email);
      // Context handles state update globally, just close modal
      onClose();
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-mii-slate hover:bg-mii-silver/50 hover:text-mii-ink transition-all"
          aria-label="Fermer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="mb-6 text-2xl font-bold text-mii-ink">
          {mode === "login" ? "Connexion" : "Inscription"}
        </h2>

        {mode === "login" ? (
          <LoginForm
            onSubmit={handleLogin}
            onSwitchToRegister={() => setMode("register")}
            error={error}
            isLoading={isSubmitting}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            onSwitchToLogin={() => setMode("login")}
            error={error}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
