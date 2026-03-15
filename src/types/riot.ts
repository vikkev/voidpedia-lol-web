/** Regiões de roteamento da API Riot (Account v1, Match v5) */
export type RiotRegion = "americas" | "europe" | "asia"

/** Erro padrão da API Riot */
export interface RiotApiError {
  status: {
    message: string
    status_code: number
  }
}
