import { useTranslation } from "@/contexts/i18n"
import { formatDuration, formatGameTime } from "@/lib/format"

interface MatchDetailHeaderProps {
  matchId: string
  gameMode: string
  gameDuration: number
  gameCreation: number
}

export function MatchDetailHeader({
  matchId,
  gameMode,
  gameDuration,
  gameCreation,
}: MatchDetailHeaderProps) {
  const { t } = useTranslation()
  const duration = formatDuration(gameDuration)
  const dateStr = formatGameTime(gameCreation)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="font-medium text-foreground">{t("matches.heading")} {matchId}</h2>
      <span className="text-sm text-muted-foreground">
        {gameMode} · {duration} · {dateStr}
      </span>
    </div>
  )
}
