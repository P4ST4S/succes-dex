import { redirect } from 'next/navigation';
import Link from 'next/link';

interface VerifyPageProps {
  searchParams: Promise<{ token?: string; error?: string }>;
}

const errorMessages: Record<string, string> = {
  invalid: 'Le lien de connexion est invalide ou manquant.',
  used: 'Ce lien a déjà été utilisé.',
  expired: 'Ce lien a expiré.',
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { token, error } = await searchParams;

  // If there's a token and no error, redirect to the API route for verification
  if (token && !error) {
    redirect(`/api/auth/verify?token=${token}`);
  }

  // Show error message
  const errorMessage = error
    ? errorMessages[error] || 'Une erreur est survenue.'
    : 'Le lien de connexion est invalide ou manquant.';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-semibold mb-2">Erreur de vérification</h1>
        <p className="text-foreground/70 mb-4">{errorMessage}</p>
        <Link href="/login" className="text-primary hover:underline">
          Demander un nouveau lien
        </Link>
      </div>
    </div>
  );
}
