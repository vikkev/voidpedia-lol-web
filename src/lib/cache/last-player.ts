import type { RiotAccount, RiotRegion } from "@/pages/home/types"

const CACHE_KEY = "voidepedia-last-player"

export type CachedLastPlayer = {
  gameName: string
  tagLine: string
  region: RiotRegion
  player: RiotAccount
}

export function getCachedLastPlayer(): CachedLastPlayer | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as CachedLastPlayer
    if (
      !data ||
      typeof data.gameName !== "string" ||
      typeof data.tagLine !== "string" ||
      !data.player?.puuid
    ) {
      return null
    }
    if (!["americas", "europe", "asia"].includes(data.region)) {
      data.region = "americas"
    }
    return data
  } catch {
    return null
  }
}

export function setCachedLastPlayer(data: CachedLastPlayer): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // ignore quota / private mode
  }
}
