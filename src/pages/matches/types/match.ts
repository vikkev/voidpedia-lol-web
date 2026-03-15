/** Campos de challenges (match-v5) usados para badges. */
export interface ParticipantChallenges {
  teamDamagePercentage?: number
  killParticipation?: number
  kda?: number
  damagePerMinute?: number
  deathsByEnemyChamps?: number
}

/** Participant in a match (match-v5). teamId: 100 = blue, 200 = red. */
export interface MatchParticipant {
  puuid: string
  teamId?: number
  riotIdGameName?: string
  riotIdTagline?: string
  summonerName?: string
  championName: string
  kills: number
  deaths: number
  assists: number
  win: boolean
  totalMinionsKilled: number
  neutralMinionsKilled: number
  /** Dados extras da API para badges */
  firstBloodKill?: boolean
  totalTimeSpentDead?: number
  challenges?: ParticipantChallenges
}

/** Match detail (match-v5) */
export interface RiotMatch {
  metadata: { matchId: string }
  info: {
    gameCreation: number
    gameDuration: number
    gameMode: string
    participants: MatchParticipant[]
  }
}
