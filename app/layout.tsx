import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { UserProvider } from "@/contexts/UserContext";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Succes Pokemon Heartgold & Soulsilver",
  description:
    "Succes Pokemon Heartgold & Soulsilver - Challenge run des succès créés par Josplay, pour Pokémon Heartgold & Soulsilver. Chaque succès peut être validé en respectant les conditions indiquées.",
  metadataBase: new URL("https://mii-achievements.local"),
  icons: {
    icon: "/icon.jpg",
    shortcut: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${pressStart.variable} bg-transparent text-mii-ink antialiased`}>
        <UserProvider>
          {children}
        </UserProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
