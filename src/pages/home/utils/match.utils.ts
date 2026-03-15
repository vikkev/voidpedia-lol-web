import type { MatchParticipant, RiotMatch } from "../types"

/** Finds the player participant (by puuid) in the match. */
export function findPlayerParticipant(
  match: RiotMatch,
  puuid: string
): MatchParticipant | undefined {
  return match.info.participants.find((p) => p.puuid === puuid)
}

export { formatDuration, formatGameTime } from "@/lib/format"
