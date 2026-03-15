import { riotFetch } from "@/lib/riot"
import type { RiotMatch, RiotRegion } from "../types"

const PATH_MATCH = "/lol/match/v5/matches"

/**
 * Fetches match detail by ID.
 * Match v5: GET /lol/match/v5/matches/{matchId}
 */
export async function getMatchDetail(
  matchId: string,
  region: RiotRegion
): Promise<RiotMatch> {
  const path = `${PATH_MATCH}/${encodeURIComponent(matchId)}`
  return riotFetch<RiotMatch>(region, path)
}
