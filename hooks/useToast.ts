'use client';

import { useContext } from 'react';
import { ToastContext, type ToastType } from '@/components/providers/ToastProvider.client';

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return {
    toast: (message: string, type: ToastType = 'info') => {
      context.addToast({ message, type });
    },
    success: (message: string) => context.addToast({ message, type: 'success' }),
    error: (message: string) => context.addToast({ message, type: 'error' }),
    info: (message: string) => context.addToast({ message, type: 'info' }),
  };
}
