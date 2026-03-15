/** Riot Summoner v4 - by-puuid */
export interface RiotSummoner {
  id: string
  accountId: string
  puuid: string
  name: string
  profileIconId: number
  revisionDate: number
  summonerLevel: number
}

/** Riot League v4 - entry (one per queue: RANKED_SOLO_5x5, RANKED_FLEX_SR, etc.) */
export interface RiotLeagueEntry {
  leagueId: string
  summonerId: string
  summonerName: string
  queueType: string
  tier: string
  rank: string
  leaguePoints: number
  wins: number
  losses: number
  veteran: boolean
  inactive: boolean
  freshBlood: boolean
  hotStreak: boolean
  miniSeries?: {
    target: number
    wins: number
    losses: number
    progress: string
  }
}
