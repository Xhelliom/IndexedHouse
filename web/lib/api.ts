const BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    credentials: 'include'
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}


