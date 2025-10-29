import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Inventaire Maison',
  description: 'Application d\'inventaire avec vision IA pour gérer vos pièces, meubles et objets',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background text-foreground">
        <main className="mx-auto max-w-6xl p-4">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}


