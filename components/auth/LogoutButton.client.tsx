'use client';

import { logout } from '@/actions/auth';
import { useTransition } from 'react';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="px-4 py-2 rounded-lg text-sm font-medium
               bg-white/5 hover:bg-white/10 border border-white/10
               transition-all disabled:opacity-50"
    >
      {isPending ? 'Déconnexion...' : 'Déconnexion'}
    </button>
  );
}
