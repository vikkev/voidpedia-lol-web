import {
  Clock,
  Droplets,
  Heart,
  Package,
  Skull,
  Swords,
} from "lucide-react"
import type { MatchParticipant } from "../types"
import { useTranslation } from "@/contexts/i18n"
import { cn } from "@/lib/utils"
import {
  type MatchBadgeId,
  getMatchBadges,
} from "@/lib/match-utils"
import { ChampionIcon } from "@/components/champion-icon"

const BADGE_ICONS: Record<MatchBadgeId, React.ComponentType<{ className?: string }>> = {
  trollMaster: Skull,
  carried: Package,
  oneManArmy: Swords,
  firstBlood: Droplets,
  foreverDead: Clock,
  supportKing: Heart,
}

interface ParticipantCardProps {
  participant: MatchParticipant
  /** Destaca o card quando é o jogador que está sendo consultado */
  isViewedPlayer?: boolean
}

function participantDisplayName(p: MatchParticipant): string {
  if (p.riotIdGameName != null && p.riotIdGameName !== "") {
    return p.riotIdTagline != null && p.riotIdTagline !== ""
      ? `${p.riotIdGameName}#${p.riotIdTagline}`
      : p.riotIdGameName
  }
  if (p.summonerName != null && p.summonerName !== "") return p.summonerName
  return ""
}

export function ParticipantCard({ participant, isViewedPlayer }: ParticipantCardProps) {
  const { t } = useTranslation()
  const { championName, win, kills, deaths, assists, totalMinionsKilled, neutralMinionsKilled } =
    participant
  const cs = totalMinionsKilled + neutralMinionsKilled
  const displayName = participantDisplayName(participant)
  const badges = getMatchBadges(participant)

  return (
    <li
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-shadow",
        win
          ? "border-victory-border bg-victory-bg"
          : "border-defeat-border bg-defeat-bg",
        isViewedPlayer &&
          "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <ChampionIcon championName={championName} size="md" />
        <div className="flex min-w-0 flex-col">
          {displayName && (
            <span className="truncate text-foreground" title={displayName}>
              {displayName}
            </span>
          )}
          <span className="font-medium capitalize text-foreground">{championName}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-xs font-medium",
            win
              ? "bg-victory-bg text-victory"
              : "bg-defeat-bg text-defeat"
          )}
        >
          {win ? t("match.result.victory") : t("match.result.defeat")}
        </span>
        {badges.map((badgeId) => {
          const Icon = BADGE_ICONS[badgeId]
          const isTroll = badgeId === "trollMaster"
          return (
            <span
              key={badgeId}
              className={cn(
                "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide",
                isTroll
                  ? "bg-defeat/90 text-white"
                  : "bg-primary/15 text-primary"
              )}
              title={t(`match.badge.${badgeId}.tooltip`)}
            >
              {Icon && <Icon className="h-3 w-3" aria-hidden />}
              {t(`match.badge.${badgeId}`)}
            </span>
          )
        })}
      </div>
      <span className="w-full text-muted-foreground">
        {kills}/{deaths}/{assists} KDA
        {cs > 0 && ` · ${cs} CS`}
      </span>
    </li>
  )
}
