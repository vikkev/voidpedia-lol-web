import type { RiotApiError, RiotRegion } from "@/types/riot"

/** Token fica no Vercel (RIOT_API_KEY); o front só usa o proxy. */
const PROXY = import.meta.env.VITE_RIOT_API_PROXY as string | undefined

/** Base URL: sempre o proxy (token no env do Vercel, não no repo). */
export function getRiotBaseUrl(): string {
  return PROXY ?? ""
}

export function getRiotHeaders(): HeadersInit {
  return { Accept: "application/json" }
}

export function isRiotProxy(): boolean {
  return Boolean(PROXY)
}

/**
 * GET na API Riot via proxy. Path: /account/..., /match/v5/... (o proxy adiciona /riot ou /lol).
 */
export async function riotFetch<T>(
  region: RiotRegion,
  path: string,
  query?: Record<string, string>
): Promise<T> {
  const base = getRiotBaseUrl()
  const search = new URLSearchParams(query)
  search.set("region", region)
  const url = search.toString() ? `${base}${path}?${search}` : `${base}${path}`

  const res = await fetch(url, { headers: getRiotHeaders() })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as RiotApiError
    const message = body?.status?.message ?? res.statusText
    throw new Error(message || `Erro ${res.status}`)
  }

  return res.json() as Promise<T>
}
