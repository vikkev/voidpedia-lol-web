import type { RiotApiError, RiotRegion } from "@/types/riot"

const REGION_BASE: Record<RiotRegion, string> = {
  americas: "https://americas.api.riotgames.com",
  europe: "https://europe.api.riotgames.com",
  asia: "https://asia.api.riotgames.com",
}

function getHeaders(useProxy: boolean): HeadersInit {
  const headers: HeadersInit = { Accept: "application/json" }
  if (!useProxy) {
    const key = import.meta.env.VITE_RIOT_API_KEY as string | undefined
    if (key) (headers as Record<string, string>)["X-Riot-Token"] = key
  }
  return headers
}

/** Base URL da API Riot para a região (ou proxy). */
export function getRiotBaseUrl(region: RiotRegion): string {
  const proxy = import.meta.env.VITE_RIOT_API_PROXY as string | undefined
  return proxy ?? REGION_BASE[region]
}

/** Headers para requisições à API Riot. */
export function getRiotHeaders(): HeadersInit {
  const useProxy = Boolean(import.meta.env.VITE_RIOT_API_PROXY)
  return getHeaders(useProxy)
}

/** Indica se está usando proxy (backend adiciona a API key). */
export function isRiotProxy(): boolean {
  return Boolean(import.meta.env.VITE_RIOT_API_PROXY)
}

/**
 * GET request to Riot API. Used by page services (home, matches).
 * Path já deve vir com barras (ex: /riot/account/v1/accounts/...).
 */
export async function riotFetch<T>(
  region: RiotRegion,
  path: string,
  query?: Record<string, string>
): Promise<T> {
  const base = getRiotBaseUrl(region)
  const useProxy = isRiotProxy()
  const search = new URLSearchParams(query)
  if (useProxy) search.set("region", region)
  const url = search.toString() ? `${base}${path}?${search}` : `${base}${path}`

  const res = await fetch(url, { headers: getRiotHeaders() })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as RiotApiError
    const message = body?.status?.message ?? res.statusText
    throw new Error(message || `Erro ${res.status}`)
  }

  return res.json() as Promise<T>
}
