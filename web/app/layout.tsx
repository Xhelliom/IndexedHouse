export const metadata = { title: 'Inventaire', description: 'Maison - pièces, meubles, objets' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white text-gray-900">
        <main className="mx-auto max-w-4xl p-4">
          {/* Fournisseurs globaux (React Query, thème, etc.) */}
          {/* eslint-disable-next-line react/no-children-prop */}
          {require('./providers').default({ children })}
        </main>
      </body>
    </html>
  );
}


