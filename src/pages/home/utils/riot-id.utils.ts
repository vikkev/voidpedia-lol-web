import type { RiotRegion } from "../types"

/** Region options for the header/home select. Label is via i18n key (region.americas, etc.). */
export const REGIONS: { value: RiotRegion; labelKey: "region.americas" | "region.europe" | "region.asia" }[] = [
  { value: "americas", labelKey: "region.americas" },
  { value: "europe", labelKey: "region.europe" },
  { value: "asia", labelKey: "region.asia" },
]

/**
 * Separa "gameName#tagLine" em { gameName, tagLine }.
 * Se não houver #, tagLine padrão é vazio.
 */
export function parseRiotId(input: string): { gameName: string; tagLine: string } {
  const trimmed = input.trim()
  const hashIndex = trimmed.indexOf("#")
  if (hashIndex === -1) {
    return { gameName: trimmed, tagLine: "" }
  }
  return {
    gameName: trimmed.slice(0, hashIndex).trim(),
    tagLine: trimmed.slice(hashIndex + 1).trim(),
  }
}
