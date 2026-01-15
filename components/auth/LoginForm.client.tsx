'use client';

import { useActionState } from 'react';
import { requestMagicLink } from '@/actions/auth';
import type { MagicLinkRequestResult } from '@/types/auth';

const initialState: MagicLinkRequestResult = { success: false };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: MagicLinkRequestResult, formData: FormData) => {
      return requestMagicLink(formData);
    },
    initialState
  );

  if (state.success) {
    return (
      <div className="glass-card text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Email envoyé !</h2>
        <p className="text-foreground/70">
          Si cette adresse est autorisée, vous recevrez un lien de connexion dans quelques instants.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="glass-card">
      <h1 className="text-2xl font-bold mb-6 text-center">Connexion Admin</h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Adresse email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="admin@example.com"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                     placeholder:text-foreground/40 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-6 rounded-xl bg-primary text-white font-semibold
                   hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all
                   flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Envoi en cours...
            </>
          ) : (
            'Envoyer le lien magique'
          )}
        </button>
      </div>

      <p className="mt-4 text-sm text-foreground/60 text-center">
        Un lien de connexion sera envoyé à votre adresse email.
      </p>
    </form>
  );
}
