import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { ToastProvider } from '@/components/providers/ToastProvider.client';
import './globals.css';

// System fonts (Google)
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// Game-specific fonts (local)
const pokemonFont = localFont({
  src: '../public/fonts/Pokemon.ttf',
  variable: '--font-pokemon-custom',
  display: 'swap',
  preload: true,
});

const zeldaFont = localFont({
  src: '../public/fonts/BOTW.otf',
  variable: '--font-zelda-custom',
  display: 'swap',
  preload: true,
});

const eldenFont = localFont({
  src: '../public/fonts/EldenRing.otf',
  variable: '--font-elden-custom',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#5fcaee',
};

export const metadata: Metadata = {
  title: 'Succès Dex',
  description: 'Suivez la progression des succès gaming à travers Pokémon, Breath of the Wild et Elden Ring',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${pokemonFont.variable}
        ${zeldaFont.variable}
        ${eldenFont.variable}
      `}
    >
      <body className="font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
