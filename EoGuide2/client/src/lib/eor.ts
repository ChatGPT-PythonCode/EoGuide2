const BASE = "https://eor-api.exile-studios.com";

async function eorFetch<T>(path: string): Promise<T> {
  const url = `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`EOR API error ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export type EorIndexRow = number | { id: number; name?: string };

export type EorNpc = { id: number; name: string; [k: string]: any };
export type EorItem = { id: number; name: string; [k: string]: any };

export const EOR = {
  base: BASE,
  listNpcs: () => eorFetch<EorIndexRow[]>("/api/npcs"),
  getNpc: (id: number) => eorFetch<EorNpc>(`/api/npcs/${id}`),
  npcGraphicUrl: (id: number) => `${BASE}/api/npcs/${id}/graphic`,

  listItems: () => eorFetch<EorIndexRow[]>("/api/items"),
  getItem: (id: number) => eorFetch<EorItem>(`/api/items/${id}`),
  itemGraphicUrl: (id: number) => `${BASE}/api/items/${id}/graphic`,
  itemGroundGraphicUrl: (id: number) => `${BASE}/api/items/${id}/graphic/ground`,
};

export function getIndexId(r: EorIndexRow): number {
  return typeof r === "number" ? r : r.id;
}

export function getIndexName(r: EorIndexRow, label: string): string {
  return typeof r === "number" ? `${label} #${r}` : (r.name || `${label} #${r.id}`);
}
