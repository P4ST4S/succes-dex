import { useReducer, useEffect, useCallback } from "react";
import type { AuthState, AuthAction } from "@/types/auth.types";

const AUTH_STORAGE_KEY = "mii-achievements::auth";

const initialState: AuthState = {
  username: "josplay",
  password: "",
  loading: false,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_CREDENTIALS":
      return {
        ...state,
        username: action.payload.username,
        password: action.payload.password,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };
    case "RESET_AUTH":
      return { ...initialState, username: state.username };
    default:
      return state;
  }
}

export function useAuth() {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Charger les credentials au montage
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const { username, password } = JSON.parse(stored);
        if (username && password) {
          dispatch({
            type: "SET_CREDENTIALS",
            payload: { username, password },
          });
          dispatch({ type: "SET_AUTHENTICATED", payload: true });
        }
      } catch {
        // Ignorer les erreurs de parsing
      }
    }
  }, []);

  const saveCredentials = useCallback((username: string, password: string) => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ username, password })
    );
    dispatch({ type: "SET_CREDENTIALS", payload: { username, password } });
    dispatch({ type: "SET_AUTHENTICATED", payload: true });
  }, []);

  const clearCredentials = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    dispatch({ type: "SET_AUTHENTICATED", payload: false });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setCredentials = useCallback((username: string, password: string) => {
    dispatch({ type: "SET_CREDENTIALS", payload: { username, password } });
  }, []);

  return {
    ...state,
    saveCredentials,
    clearCredentials,
    setLoading,
    setCredentials,
  };
}
