/**
 * Data Dragon (Riot CDN) — versão fixa para evitar request extra.
 * Atualize quando quiser pegar assets de um patch mais novo.
 */
const DDragon_VERSION = "14.24.1"
const CDN_BASE = "https://ddragon.leagueoflegends.com/cdn"

/** URL da imagem do campeão (tile). championKey = championName da API match-v5. */
export function getChampionImageUrl(championKey: string): string {
  const key = championKey.trim() || "Unknown"
  return `${CDN_BASE}/${DDragon_VERSION}/img/champion/${encodeURIComponent(key)}.png`
}
