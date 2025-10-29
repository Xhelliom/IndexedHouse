export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Inventaire Maison</h1>
      <p className="text-sm text-gray-600">Créez des pièces, des meubles, et ajoutez des objets par photo.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <a className="rounded border p-4 hover:bg-gray-50" href="/rooms">Pièces</a>
        <a className="rounded border p-4 hover:bg-gray-50" href="/containers">Meubles</a>
        <a className="rounded border p-4 hover:bg-gray-50" href="/items">Objets</a>
      </div>
    </div>
  );
}


