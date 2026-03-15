import { riotFetch } from "@/lib/riot"
import type { RiotMatch, RiotRegion } from "../types"

/**
 * Match v5 API (doc):
 * - GET /lol/match/v5/matches/by-puuid/{puuid}/ids     → list match ids by puuid
 * - GET /lol/match/v5/matches/by-puuid/{puuid}/replays → player replays
 * - GET /lol/match/v5/matches/{matchId}               → match by id
 * - GET /lol/match/v5/matches/{matchId}/timeline      → match timeline
 */
const PATH_MATCH_IDS = "/lol/match/v5/matches/by-puuid"
const PATH_MATCH = "/lol/match/v5/matches"
const DEFAULT_MATCH_COUNT = 10
const PAGE_SIZE = 10

/** Máximo de requisições simultâneas para detalhes de partida (evita 429). */
const MATCH_DETAIL_CONCURRENCY = 2
const DELAY_BETWEEN_BATCHES_MS = 120

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const batchResults = await Promise.all(batch.map(fn))
    results.push(...batchResults)
    if (i + concurrency < items.length) {
      await new Promise((r) => setTimeout(r, DELAY_BETWEEN_BATCHES_MS))
    }
  }
  return results
}

/**
 * Lists the player's match IDs (newest first). Sem filtro de queue (problema na API da Riot).
 * Match v5: GET /lol/match/v5/matches/by-puuid/{puuid}/ids
 * Query params: start, count (max 100).
 */
export async function getMatchIds(
  puuid: string,
  region: RiotRegion,
  count = PAGE_SIZE,
  start = 0
): Promise<string[]> {
  const path = `${PATH_MATCH_IDS}/${encodeURIComponent(puuid)}/ids`
  const query: Record<string, string> = {
    start: String(start),
    count: String(Math.min(100, Math.max(0, count))),
  }
  return riotFetch<string[]>(region, path, query)
}

/**
 * Fetches a single match by ID.
 * Match v5: GET /lol/match/v5/matches/{matchId}
 */
export async function getMatchDetail(
  matchId: string,
  region: RiotRegion
): Promise<RiotMatch> {
  const path = `${PATH_MATCH}/${encodeURIComponent(matchId)}`
  return riotFetch<RiotMatch>(region, path)
}

/**
 * Fetches a page of matches with full details (IDs + each match detail).
 * Sem filtro de queue; a API da Riot retorna o que retornar.
 * Uses limited concurrency and delay between batches to avoid 429 rate limit.
 * Matches are returned in chronological order (newest first).
 */
export async function getMatchHistory(
  puuid: string,
  region: RiotRegion,
  count = DEFAULT_MATCH_COUNT,
  start = 0
): Promise<RiotMatch[]> {
  const ids = await getMatchIds(puuid, region, count, start)
  const matches = await runWithConcurrency(
    ids,
    MATCH_DETAIL_CONCURRENCY,
    (id) => getMatchDetail(id, region)
  )
  return matches.sort(
    (a, b) => (b.info.gameCreation ?? 0) - (a.info.gameCreation ?? 0)
  )
}
