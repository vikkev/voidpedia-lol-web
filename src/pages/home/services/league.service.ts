import { riotFetchPlatform } from "@/lib/riot"
import type { RiotPlatform } from "@/types/riot"
import type { RiotLeagueEntry, RiotSummoner } from "../types/league.types"

const PATH_SUMMONER_BY_PUUID = "/lol/summoner/v4/summoners/by-puuid"
const PATH_LEAGUE_ENTRIES = "/lol/league/v4/entries/by-summoner"

export async function getSummonerByPuuid(
  platform: RiotPlatform,
  puuid: string
): Promise<RiotSummoner> {
  const path = `${PATH_SUMMONER_BY_PUUID}/${encodeURIComponent(puuid)}`
  return riotFetchPlatform<RiotSummoner>(platform, path)
}

export async function getLeagueEntries(
  platform: RiotPlatform,
  summonerId: string
): Promise<RiotLeagueEntry[]> {
  const path = `${PATH_LEAGUE_ENTRIES}/${encodeURIComponent(summonerId)}`
  return riotFetchPlatform<RiotLeagueEntry[]>(platform, path)
}
