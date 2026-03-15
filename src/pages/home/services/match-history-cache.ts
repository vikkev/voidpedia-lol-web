import type { RiotMatch, RiotRegion } from "../types"
import { getMatchHistory } from "./match.service"

const CACHE_TTL_MS = 2 * 60 * 1000 // 2 minutes

type CacheEntry = {
  data: RiotMatch[]
  timestamp: number
}

const cache = new Map<string, CacheEntry>()

function cacheKey(puuid: string, region: RiotRegion): string {
  return `${puuid}:${region}`
}

/**
 * Histórico de partidas com cache em memória para evitar requisições
 * repetidas ao voltar para a home ou por re-renders/Strict Mode.
 */
export async function getMatchHistoryCached(
  puuid: string,
  region: RiotRegion,
  count = 10
): Promise<RiotMatch[]> {
  const key = cacheKey(puuid, region)
  const now = Date.now()
  const entry = cache.get(key)

  if (entry && now - entry.timestamp < CACHE_TTL_MS) {
    return entry.data
  }

  const data = await getMatchHistory(puuid, region, count, 0)
  cache.set(key, { data, timestamp: now })
  return data
}
