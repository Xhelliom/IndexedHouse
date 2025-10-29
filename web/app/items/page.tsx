'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../../lib/api';

type Item = { id: string; title: string; description?: string | null; quantity: number; primaryContainerId?: string | null; roomId?: string | null };
type Room = { id: string; name: string };
type Container = { id: string; name: string };

export default function ItemsPage() {
  const qc = useQueryClient();
  const rooms = useQuery({ queryKey: ['rooms'], queryFn: () => api<Room[]>('/rooms') });
  const containers = useQuery({ queryKey: ['containers'], queryFn: () => api<Container[]>('/containers') });
  const { data, isLoading, error } = useQuery({ queryKey: ['items'], queryFn: () => api<Item[]>('/items') });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [roomId, setRoomId] = useState('');
  const [containerId, setContainerId] = useState('');

  const create = useMutation({
    mutationFn: (payload: Partial<Item> & { title: string; quantity: number }) =>
      api<Item>('/items', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      setTitle(''); setDescription(''); setQuantity(1); setRoomId(''); setContainerId('');
      void qc.invalidateQueries({ queryKey: ['items'] });
    }
  });

  const update = useMutation({
    mutationFn: (i: Partial<Item> & { id: string }) => api<Item>(`/items/${i.id}`, { method: 'PATCH', body: JSON.stringify(i) }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['items'] })
  });

  const remove = useMutation({
    mutationFn: (id: string) => api(`/items/${id}`, { method: 'DELETE' }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['items'] })
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Objets</h1>

      <form
        className="grid grid-cols-1 gap-2 sm:grid-cols-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          create.mutate({ title, description: description || undefined, quantity, roomId: roomId || undefined, primaryContainerId: containerId || undefined });
        }}
      >
        <input className="rounded border p-2" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="rounded border p-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="rounded border p-2" type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value || '1'))} />
        <select className="rounded border p-2" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="">(Aucune pièce)</option>
          {(rooms.data || []).map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <select className="rounded border p-2" value={containerId} onChange={(e) => setContainerId(e.target.value)}>
          <option value="">(Aucun meuble)</option>
          {(containers.data || []).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">Ajouter</button>
      </form>

      {isLoading && <p>Chargement…</p>}
      {error && <p className="text-red-600">Erreur: {(error as Error).message}</p>}

      <ul className="divide-y rounded border">
        {(data || []).map((it) => (
          <li key={it.id} className="grid grid-cols-1 items-center gap-2 p-2 sm:grid-cols-6">
            <input className="rounded border p-2" defaultValue={it.title} onBlur={(e) => update.mutate({ id: it.id, title: e.target.value })} />
            <input className="rounded border p-2" defaultValue={it.description ?? ''} onBlur={(e) => update.mutate({ id: it.id, description: e.target.value })} />
            <input className="rounded border p-2" type="number" min={1} defaultValue={it.quantity} onBlur={(e) => update.mutate({ id: it.id, quantity: parseInt(e.target.value || '1') })} />
            <select className="rounded border p-2" defaultValue={it.roomId ?? ''} onChange={(e) => update.mutate({ id: it.id, roomId: e.target.value || null })}>
              <option value="">(Aucune pièce)</option>
              {(rooms.data || []).map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <select className="rounded border p-2" defaultValue={it.primaryContainerId ?? ''} onChange={(e) => update.mutate({ id: it.id, primaryContainerId: e.target.value || null })}>
              <option value="">(Aucun meuble)</option>
              {(containers.data || []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button className="rounded bg-red-600 px-3 py-2 text-white" onClick={() => remove.mutate(it.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


