import type { MatchParticipant } from "@/pages/matches/types/match"

export type MatchBadgeId =
  | "trollMaster"
  | "carried"
  | "oneManArmy"
  | "firstBlood"
  | "foreverDead"
  | "supportKing"

/**
 * Badges engraçados baseados nos dados reais da API (challenges, totalTimeSpentDead, etc).
 * Retorna array de IDs para exibir no card e no histórico.
 */
export function getMatchBadges(p: MatchParticipant): MatchBadgeId[] {
  const badges: MatchBadgeId[] = []
  const { win, kills, deaths, assists } = p
  const teamDmg = p.challenges?.teamDamagePercentage
  const killPart = p.challenges?.killParticipation
  const timeDead = p.totalTimeSpentDead ?? 0

  if (!win && (deaths >= 10 || (deaths >= 6 && kills + assists < deaths))) {
    badges.push("trollMaster")
  }

  if (win && teamDmg != null && teamDmg < 0.12) {
    badges.push("carried")
  }

  if (teamDmg != null && teamDmg > 0.28 && (killPart ?? 0) > 0.7) {
    badges.push("oneManArmy")
  }

  if (p.firstBloodKill) {
    badges.push("firstBlood")
  }

  if (timeDead >= 300) {
    badges.push("foreverDead")
  }

  if (assists >= 28 && win) {
    badges.push("supportKing")
  }

  return badges
}
