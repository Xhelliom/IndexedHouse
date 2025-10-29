'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Boxes, Plus, Trash2 } from 'lucide-react';

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
      <div className="flex items-center gap-2">
        <Boxes className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Objets</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un objet</CardTitle>
          <CardDescription>Créez un nouvel objet dans votre inventaire</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) return;
              create.mutate({ title, description: description || undefined, quantity, roomId: roomId || undefined, primaryContainerId: containerId || undefined });
            }}
          >
            <div>
              <label className="text-sm font-medium">Titre *</label>
              <Input
                placeholder="Nom de l'objet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Description optionnelle"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Quantité</label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value || '1'))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Pièce</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              >
                <option value="">(Aucune pièce)</option>
                {(rooms.data || []).map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Meuble</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={containerId}
                onChange={(e) => setContainerId(e.target.value)}
              >
                <option value="">(Aucun meuble)</option>
                {(containers.data || []).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="col-span-2" disabled={create.isPending || !title.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && <p className="text-muted-foreground">Chargement…</p>}
      {error && <p className="text-destructive">Erreur: {(error as Error).message}</p>}

      <div className="grid gap-3">
        {(data || []).map((it) => (
          <Card key={it.id}>
            <CardContent className="pt-6">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Titre"
                  defaultValue={it.title}
                  onBlur={(e) => update.mutate({ id: it.id, title: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  defaultValue={it.description ?? ''}
                  onBlur={(e) => update.mutate({ id: it.id, description: e.target.value })}
                />
                <Input
                  type="number"
                  min={1}
                  defaultValue={it.quantity}
                  onBlur={(e) => update.mutate({ id: it.id, quantity: parseInt(e.target.value || '1') })}
                />
                <div className="flex gap-2">
                  <select
                    className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={it.roomId ?? ''}
                    onChange={(e) => update.mutate({ id: it.id, roomId: e.target.value || null })}
                  >
                    <option value="">(Aucune pièce)</option>
                    {(rooms.data || []).map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  <select
                    className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={it.primaryContainerId ?? ''}
                    onChange={(e) => update.mutate({ id: it.id, primaryContainerId: e.target.value || null })}
                  >
                    <option value="">(Aucun meuble)</option>
                    {(containers.data || []).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <Button variant="destructive" size="icon" onClick={() => remove.mutate(it.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
