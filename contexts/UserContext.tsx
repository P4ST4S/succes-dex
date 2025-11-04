"use client";

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "mii-achievements::completed";

export interface User {
  id: string;
  username: string;
  email: string | null;
  createdAt: string;
  completedIds: string[];
}

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

// Helper to get localStorage data
function getLocalStorageCompletedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Helper to clear localStorage data
function clearLocalStorageCompletedIds(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync localStorage achievements to DB
  const syncLocalToDb = useCallback(async () => {
    const localCompletedIds = getLocalStorageCompletedIds();

    if (localCompletedIds.length === 0) return;

    try {
      const response = await fetch("/api/achievements/sync-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localCompletedIds }),
      });

      if (response.ok) {
        // Clear localStorage after successful sync
        clearLocalStorageCompletedIds();
        console.log("✅ LocalStorage achievements synced to DB");
      }
    } catch (err) {
      console.error("Failed to sync localStorage to DB:", err);
    }
  }, []);

  // Fetch current user
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(
    async (identifier: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        await fetchUser();

        // Sync localStorage to DB after successful login
        await syncLocalToDb();
        // Refresh user to get updated completedIds
        await fetchUser();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUser, syncLocalToDb]
  );

  // Register
  const register = useCallback(
    async (username: string, password: string, email?: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        await fetchUser();

        // Sync localStorage to DB after successful registration
        await syncLocalToDb();
        // Refresh user to get updated completedIds
        await fetchUser();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Registration failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUser, syncLocalToDb]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value: UserContextValue = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    refreshUser: fetchUser,
    error,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
