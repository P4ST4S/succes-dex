"use client";

import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import type { ActionType } from "@/types/auth.types";

const STORAGE_KEY = "mii-achievements::completed";

export const SyncButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType>("sync");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const auth = useAuth();
  const toast = useToast();

  const getCompletedCount = () => {
    try {
      const storedCompletedIds = localStorage.getItem(STORAGE_KEY);
      const completedIds = storedCompletedIds
        ? JSON.parse(storedCompletedIds)
        : [];
      return completedIds.length;
    } catch {
      return 0;
    }
  };

  const handleFetch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    auth.setLoading(true);
    setMessage(null);

    try {
      const progressResponse = await fetch(`/api/progress/${auth.username}`, {
        cache: "no-store",
      });

      if (!progressResponse.ok) {
        throw new Error("Erreur lors de la récupération de la progression");
      }

      const progressData = await progressResponse.json();

      auth.saveCredentials(auth.username, auth.password);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progressData.completedIds)
      );
      window.dispatchEvent(new Event("storage"));

      setMessage({
        type: "success",
        text: `Récupéré ! ${progressData.completedIds.length} succès validés`,
      });

      toast.showToastMessage({
        message: `Récupéré ! ${progressData.completedIds.length} succès`,
        type: "success",
      });

      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      auth.clearCredentials();
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Erreur de récupération",
      });
    } finally {
      auth.setLoading(false);
    }
  };

  const handleSync = async (e?: React.FormEvent) => {
    e?.preventDefault();
    auth.setLoading(true);
    setMessage(null);

    try {
      const storedCompletedIds = localStorage.getItem(STORAGE_KEY);
      const completedIds = storedCompletedIds
        ? JSON.parse(storedCompletedIds)
        : [];

      const credentials = btoa(`${auth.username}:${auth.password}`);
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

      auth.saveCredentials(auth.username, auth.password);

      const progressResponse = await fetch(`/api/progress/${auth.username}`, {
        cache: "no-store",
      });

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(progressData.completedIds)
        );
        window.dispatchEvent(new Event("storage"));
      }

      setMessage({
        type: "success",
        text: `Synchronisé ! ${data.synced} succès (${data.added} ajoutés, ${data.removed} supprimés)`,
      });

      toast.showToastMessage({
        message: `Synchronisé ! ${data.synced} succès`,
        type: "success",
      });

      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      auth.clearCredentials();
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Erreur de synchronisation",
      });
    } finally {
      auth.setLoading(false);
    }
  };

  const handleQuickFetch = () => {
    setActionType("fetch");
    if (auth.isAuthenticated) {
      handleFetch();
    } else {
      setIsOpen(true);
    }
  };

  const handleQuickSync = () => {
    setActionType("sync");
    if (auth.isAuthenticated) {
      handleSync();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleQuickFetch}
          disabled={auth.loading}
          className="inline-flex min-w-60 items-center justify-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-cyan-600 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {auth.loading ? (
            <svg
              className="size-4 animate-spin shrink-0"
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
              className="size-4 shrink-0"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          <span className="whitespace-nowrap">
            {auth.loading ? "Récupération..." : "Récupérer"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleQuickSync}
          disabled={auth.loading}
          className="inline-flex min-w-60 items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {auth.loading ? (
            <svg
              className="size-4 animate-spin shrink-0"
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
              className="size-4 shrink-0"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          )}
          <span className="whitespace-nowrap">
            {auth.loading ? "Synchronisation..." : "Synchroniser"}
          </span>
        </button>
      </div>

      <AuthModal
        isOpen={isOpen}
        actionType={actionType}
        username={auth.username}
        password={auth.password}
        loading={auth.loading}
        message={message}
        completedCount={getCompletedCount()}
        onUsernameChange={(value) => auth.setCredentials(value, auth.password)}
        onPasswordChange={(value) => auth.setCredentials(auth.username, value)}
        onSubmit={actionType === "fetch" ? handleFetch : handleSync}
        onClose={() => setIsOpen(false)}
      />

      {toast.showToast && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-3 rounded-2xl bg-linear-to-r from-green-500 to-emerald-500 px-6 py-4 text-white shadow-2xl">
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
            <span className="font-bold text-base">{toast.toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};
