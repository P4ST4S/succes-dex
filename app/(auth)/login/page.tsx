import { LoginForm } from '@/components/auth/LoginForm.client';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
