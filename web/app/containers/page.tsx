'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../../lib/api';

type Container = { id: string; name: string; type: string; roomId?: string | null; parentContainerId?: string | null };
type Room = { id: string; name: string };

export default function ContainersPage() {
  const qc = useQueryClient();
  const rooms = useQuery({ queryKey: ['rooms'], queryFn: () => api<Room[]>('/rooms') });
  const { data, isLoading, error } = useQuery({ queryKey: ['containers'], queryFn: () => api<Container[]>('/containers') });

  const [name, setName] = useState('');
  const [type, setType] = useState('meuble');
  const [roomId, setRoomId] = useState<string>('');

  const create = useMutation({
    mutationFn: (payload: { name: string; type: string; roomId?: string }) => api<Container>('/containers', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => { setName(''); setType('meuble'); void qc.invalidateQueries({ queryKey: ['containers'] }); }
  });

  const update = useMutation({
    mutationFn: (c: Partial<Container> & { id: string }) => api<Container>(`/containers/${c.id}`, { method: 'PATCH', body: JSON.stringify(c) }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['containers'] })
  });

  const remove = useMutation({
    mutationFn: (id: string) => api(`/containers/${id}`, { method: 'DELETE' }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['containers'] })
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Meubles / Rangements</h1>

      <form
        className="grid grid-cols-1 gap-2 sm:grid-cols-4"
        onSubmit={(e) => { e.preventDefault(); create.mutate({ name, type, roomId: roomId || undefined }); }}
      >
        <input className="rounded border p-2" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded border p-2" placeholder="Type (ex: armoire, étagère)" value={type} onChange={(e) => setType(e.target.value)} />
        <select className="rounded border p-2" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="">(Aucune pièce)</option>
          {(rooms.data || []).map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">Ajouter</button>
      </form>

      {isLoading && <p>Chargement…</p>}
      {error && <p className="text-red-600">Erreur: {(error as Error).message}</p>}

      <ul className="divide-y rounded border">
        {(data || []).map((c) => (
          <li key={c.id} className="grid grid-cols-1 items-center gap-2 p-2 sm:grid-cols-5">
            <input className="rounded border p-2" defaultValue={c.name} onBlur={(e) => update.mutate({ id: c.id, name: e.target.value })} />
            <input className="rounded border p-2" defaultValue={c.type} onBlur={(e) => update.mutate({ id: c.id, type: e.target.value })} />
            <select className="rounded border p-2" defaultValue={c.roomId ?? ''} onChange={(e) => update.mutate({ id: c.id, roomId: e.target.value || null })}>
              <option value="">(Aucune pièce)</option>
              {(rooms.data || []).map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <a className="rounded border px-3 py-2 text-center hover:bg-gray-50" href={`/containers/${c.id}`}>Détails</a>
            <button className="rounded bg-red-600 px-3 py-2 text-white" onClick={() => remove.mutate(c.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


