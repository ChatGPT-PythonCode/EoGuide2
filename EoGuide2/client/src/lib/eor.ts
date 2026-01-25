const BASE = "https://eor-api.exile-studios.com";

async function eorFetch<T>(path: string): Promise<T> {
  const url = `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`EOR API error ${res.status}`);
  return (await res.json()) as T;
}

export type EorNpcIndexRow = number | { id: number; name?: string };
export type EorItemIndexRow = number | { id: number; name?: string };

export type EorNpc = { id: number; name: string; [k: string]: any };
export type EorItem = { id: number; name: string; [k: string]: any };

export const EOR = {
  base: BASE,
  listNpcs: () => eorFetch<EorNpcIndexRow[]>("/api/npcs"),
  getNpc: (id: number) => eorFetch<EorNpc>(`/api/npcs/${id}`),
  npcGraphicUrl: (id: number) => `${BASE}/api/npcs/${id}/graphic`,

  listItems: () => eorFetch<EorItemIndexRow[]>("/api/items"),
  getItem: (id: number) => eorFetch<EorItem>(`/api/items/${id}`),
  itemGraphicUrl: (id: number) => `${BASE}/api/items/${id}/graphic`,
  itemGroundGraphicUrl: (id: number) => `${BASE}/api/items/${id}/graphic/ground`,
};
