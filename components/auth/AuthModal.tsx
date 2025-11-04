import { AuthForm } from "./AuthForm";
import type { ActionType } from "@/types/auth.types";

interface AuthModalProps {
  isOpen: boolean;
  actionType: ActionType;
  username: string;
  password: string;
  loading: boolean;
  message: { type: "success" | "error"; text: string } | null;
  completedCount: number;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  actionType,
  username,
  password,
  loading,
  message,
  completedCount,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onClose,
}) => {
  if (!isOpen) return null;

  const title =
    actionType === "fetch"
      ? "Récupérer depuis le serveur"
      : "Synchroniser avec le serveur";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-mii-ink">{title}</h2>
          <button
            onClick={onClose}
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

        <AuthForm
          username={username}
          password={password}
          loading={loading}
          actionType={actionType}
          message={message}
          completedCount={completedCount}
          onUsernameChange={onUsernameChange}
          onPasswordChange={onPasswordChange}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};
