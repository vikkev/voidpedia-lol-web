import { riotFetch } from "@/lib/riot"
import type { RiotAccount, RiotRegion } from "../types"

/** Path sem /riot para não duplicar na URL do proxy (/api/riot/account/...). */
const PATH_ACCOUNT_BY_RIOT_ID = "/account/v1/accounts/by-riot-id"

/**
 * Busca dados do jogador pelo Riot ID na região informada.
 * Account v1: GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
 */
export async function getPlayer(
  gameName: string,
  tagLine: string,
  region: RiotRegion = "americas"
): Promise<RiotAccount> {
  const path = `${PATH_ACCOUNT_BY_RIOT_ID}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
  return riotFetch<RiotAccount>(region, path)
}
