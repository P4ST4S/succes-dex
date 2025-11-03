"use client";

import { useEffect, useState } from "react";

interface SyncButtonProps {
  completedIds: string[];
}

const AUTH_STORAGE_KEY = "mii-achievements::auth";

export const SyncButton: React.FC<SyncButtonProps> = ({ completedIds }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("josplay");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Charger les credentials depuis localStorage au montage
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const { username: storedUsername, password: storedPassword } = JSON.parse(stored);
        if (storedUsername && storedPassword) {
          setUsername(storedUsername);
          setPassword(storedPassword);
          setIsAuthenticated(true);
        }
      } catch {
        // Ignorer les erreurs de parsing
      }
    }
  }, []);

  const handleSync = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const credentials = btoa(`${username}:${password}`);
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({ completedIds }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur de synchronisation");
      }

      // Sauvegarder les credentials en cas de succès
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ username, password })
      );
      setIsAuthenticated(true);

      setMessage({
        type: "success",
        text: `Synchronisé ! ${data.synced} succès (${data.added} ajoutés, ${data.removed} supprimés)`,
      });

      // Afficher le toast de succès
      setToastMessage(`Synchronisé ! ${data.synced} succès`);
      setShowToast(true);

      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => setShowToast(false), 3000);
      }, 2000);
    } catch (error) {
      // En cas d'erreur d'auth, supprimer les credentials stockés
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(false);
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Erreur de synchronisation",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sync automatique si déjà authentifié
  const handleQuickSync = () => {
    if (isAuthenticated) {
      handleSync();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleQuickSync}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm font-bold text-white shadow-xl transition-all duration-200 hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <svg
            className="size-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
        )}
        {loading ? "Synchronisation..." : "Synchroniser ma progression"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-mii-ink">
                Synchroniser avec le serveur
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-mii-slate transition-colors hover:bg-mii-silver/50 hover:text-mii-ink"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="mb-4 text-sm text-mii-slate">
              Synchronise ta progression locale ({completedIds.length} succès
              validés) avec le serveur pour que tout le monde puisse voir ton
              avancement.
            </p>

            <form onSubmit={handleSync} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-semibold text-mii-ink"
                >
                  Nom d&apos;utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border-2 border-mii-silver bg-white px-4 py-2 text-mii-ink transition-all focus:border-mii-sky-400 focus:outline-none focus:ring-4 focus:ring-mii-sky-400/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-semibold text-mii-ink"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-mii-silver bg-white px-4 py-2 text-mii-ink transition-all focus:border-mii-sky-400 focus:outline-none focus:ring-4 focus:ring-mii-sky-400/20"
                  required
                />
              </div>

              {message && (
                <div
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-medium ${
                    message.type === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-xl border-2 border-mii-silver bg-white px-4 py-2.5 font-semibold text-mii-slate transition-all hover:bg-mii-silver/50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2.5 font-bold text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Synchronisation..." : "Synchroniser"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast de confirmation */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="font-bold text-base">{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};
