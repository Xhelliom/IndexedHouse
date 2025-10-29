'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Trash2 } from 'lucide-react';

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
      <div className="flex items-center gap-2">
        <MapPin className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Pièces</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter une pièce</CardTitle>
          <CardDescription>Créez une nouvelle pièce de votre maison</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              create.mutate({ name });
            }}
          >
            <Input
              className="flex-1"
              placeholder="Nom de la pièce (ex: Salon, Cuisine)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit" disabled={create.isPending || !name.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && <p className="text-muted-foreground">Chargement…</p>}
      {error && <p className="text-destructive">Erreur: {(error as Error).message}</p>}

      <div className="grid gap-3">
        {(data || []).map((r) => (
          <Card key={r.id}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  defaultValue={r.name}
                  onBlur={(e) => update.mutate({ ...r, name: e.target.value })}
                />
                <Button variant="destructive" size="icon" onClick={() => remove.mutate(r.id)}>
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


