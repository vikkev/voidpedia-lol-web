import { Link } from "react-router-dom"
import {
  Clock,
  Droplets,
  Heart,
  Package,
  Skull,
  Swords,
} from "lucide-react"
import type { RiotMatch } from "../types"
import { findPlayerParticipant } from "../utils/match.utils"
import { useTranslation } from "@/contexts/i18n"
import { formatDuration, formatGameTime } from "@/lib/format"
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

interface MatchHistoryItemProps {
  match: RiotMatch
  puuid: string
  region: string
}

export function MatchHistoryItem({ match, puuid, region }: MatchHistoryItemProps) {
  const { t } = useTranslation()
  const player = findPlayerParticipant(match, puuid)
  if (!player) return null

  const duration = formatDuration(match.info.gameDuration)
  const timeAgo = formatGameTime(match.info.gameCreation)
  const matchUrl = `/matches/${match.metadata.matchId}?region=${region}&puuid=${encodeURIComponent(puuid)}`
  const badges = getMatchBadges(player)

  return (
    <li>
      <Link
        to={matchUrl}
        className={cn(
          "block rounded-lg border p-3 text-sm transition-colors hover:bg-card-hover",
          player.win
            ? "border-victory-border bg-victory-bg"
            : "border-defeat-border bg-defeat-bg"
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <ChampionIcon championName={player.championName} size="sm" />
            <span className="font-medium capitalize">{player.championName}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-xs font-medium",
                player.win
                  ? "bg-victory-bg text-victory"
                  : "bg-defeat-bg text-defeat"
              )}
            >
              {player.win ? t("match.result.victory") : t("match.result.defeat")}
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
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0 text-muted-foreground">
          <span>
            {player.kills}/{player.deaths}/{player.assists} KDA
          </span>
          <span>{duration}</span>
          <span>{timeAgo}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {match.info.gameMode}
        </p>
      </Link>
    </li>
  )
}
