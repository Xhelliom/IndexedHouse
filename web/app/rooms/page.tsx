'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../../lib/api';

type Room = { id: string; name: string };

export default function RoomsPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => api<Room[]>('/rooms')
  });
  const [name, setName] = useState('');

  const create = useMutation({
    mutationFn: (payload: { name: string }) => api<Room>('/rooms', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      setName('');
      void qc.invalidateQueries({ queryKey: ['rooms'] });
    }
  });

  const update = useMutation({
    mutationFn: (room: Room) => api<Room>(`/rooms/${room.id}`, { method: 'PATCH', body: JSON.stringify({ name: room.name }) }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['rooms'] })
  });

  const remove = useMutation({
    mutationFn: (id: string) => api(`/rooms/${id}`, { method: 'DELETE' }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['rooms'] })
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Pièces</h1>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          create.mutate({ name });
        }}
      >
        <input className="flex-1 rounded border p-2" placeholder="Nom de la pièce" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">Ajouter</button>
      </form>

      {isLoading && <p>Chargement…</p>}
      {error && <p className="text-red-600">Erreur: {(error as Error).message}</p>}

      <ul className="divide-y rounded border">
        {(data || []).map((r) => (
          <li key={r.id} className="flex items-center gap-2 p-2">
            <input
              className="flex-1 rounded border p-2"
              defaultValue={r.name}
              onBlur={(e) => update.mutate({ ...r, name: e.target.value })}
            />
            <button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => remove.mutate(r.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


