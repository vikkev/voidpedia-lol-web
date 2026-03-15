/** Regiões de roteamento da API Riot (Account v1, Match v5) */
export type RiotRegion = "americas" | "europe" | "asia"

/** Platform para Summoner v4 / League v4 (uma por servidor) */
export type RiotPlatform =
  | "br1"
  | "na1"
  | "la1"
  | "la2"
  | "euw1"
  | "eun1"
  | "tr1"
  | "ru"
  | "jp1"
  | "kr"
  | "oc1"

/** Erro padrão da API Riot */
export interface RiotApiError {
  status: {
    message: string
    status_code: number
  }
}
