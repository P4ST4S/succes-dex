import type { ActionType } from "@/types/auth.types";

interface AuthFormProps {
  username: string;
  password: string;
  loading: boolean;
  actionType: ActionType;
  message: { type: "success" | "error"; text: string } | null;
  completedCount: number;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  username,
  password,
  loading,
  actionType,
  message,
  completedCount,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onCancel,
}) => {
  const isFetch = actionType === "fetch";

  return (
    <>
      <p className="mb-4 text-sm text-mii-slate">
        {isFetch
          ? "Récupère la progression depuis le serveur pour mettre à jour tes succès locaux avec ceux déjà validés par ton équipe."
          : `Synchronise ta progression locale (${completedCount} succès validés) avec le serveur pour que tout le monde puisse voir ton avancement.`}
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
            onChange={(e) => onUsernameChange(e.target.value)}
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
            onChange={(e) => onPasswordChange(e.target.value)}
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
            onClick={onCancel}
            className="flex-1 rounded-xl border-2 border-mii-silver bg-white px-4 py-2.5 font-semibold text-mii-slate transition-all hover:bg-mii-silver/50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 rounded-xl bg-gradient-to-r px-4 py-2.5 font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 ${
              isFetch
                ? "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                : "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            }`}
          >
            {loading
              ? isFetch
                ? "Récupération..."
                : "Synchronisation..."
              : isFetch
              ? "Récupérer"
              : "Synchroniser"}
          </button>
        </div>
      </form>
    </>
  );
};
