'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus, Trash2 } from 'lucide-react';

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
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Meubles & Rangements</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un meuble ou rangement</CardTitle>
          <CardDescription>Créez un nouveau meuble ou espace de rangement</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 sm:grid-cols-4"
            onSubmit={(e) => { e.preventDefault(); create.mutate({ name, type, roomId: roomId || undefined }); }}
          >
            <Input
              placeholder="Nom (ex: Armoire, Étagère)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Type (ex: meuble, étagère, tiroir)"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            >
              <option value="">(Aucune pièce)</option>
              {(rooms.data || []).map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <Button type="submit" disabled={create.isPending}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && <p className="text-muted-foreground">Chargement…</p>}
      {error && <p className="text-destructive">Erreur: {(error as Error).message}</p>}

      <div className="grid gap-3">
        {(data || []).map((c) => (
          <Card key={c.id}>
            <CardContent className="pt-6">
              <div className="grid gap-2 sm:grid-cols-5 sm:items-center">
                <Input
                  defaultValue={c.name}
                  onBlur={(e) => update.mutate({ id: c.id, name: e.target.value })}
                />
                <Input
                  defaultValue={c.type}
                  onBlur={(e) => update.mutate({ id: c.id, type: e.target.value })}
                />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={c.roomId ?? ''}
                  onChange={(e) => update.mutate({ id: c.id, roomId: e.target.value || null })}
                >
                  <option value="">(Aucune pièce)</option>
                  {(rooms.data || []).map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <Button variant="outline" size="sm" className="justify-center">
                  Détails
                </Button>
                <Button variant="destructive" size="icon" onClick={() => remove.mutate(c.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
