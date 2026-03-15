import { useTranslation } from "@/contexts/i18n"
import type { RiotLeagueEntry } from "../types/league.types"

const QUEUE_LABEL: Record<string, "rank.queue.solo" | "rank.queue.flex"> = {
  RANKED_SOLO_5x5: "rank.queue.solo",
  RANKED_FLEX_SR: "rank.queue.flex",
}

export interface PlayerRankItemProps {
  entry: RiotLeagueEntry
}

export function PlayerRankItem({ entry }: PlayerRankItemProps) {
  const { t } = useTranslation()
  const queueLabel = QUEUE_LABEL[entry.queueType] ?? "rank.queue.other"
  const tierRank = [entry.tier, entry.rank].filter(Boolean).join(" ")

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
      <span className="font-medium text-foreground">{t(queueLabel)}</span>
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="font-display text-foreground">{tierRank}</span>
        <span>{entry.leaguePoints} {t("rank.lp")}</span>
        <span>
          {entry.wins} {t("rank.wins")} / {entry.losses} {t("rank.losses")}
        </span>
      </div>
    </div>
  )
}
