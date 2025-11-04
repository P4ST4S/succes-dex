export type ActionType = "fetch" | "sync";

export interface AuthState {
  username: string;
  password: string;
  loading: boolean;
  isAuthenticated: boolean;
}

export type AuthAction =
  | { type: "SET_CREDENTIALS"; payload: { username: string; password: string } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "RESET_AUTH" };

export interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}
