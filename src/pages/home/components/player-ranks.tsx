import { useEffect, useState } from "react"
import { useTranslation } from "@/contexts/i18n"
import type { RiotRegion } from "../types"
import type { RiotLeagueEntry } from "../types/league.types"
import { getLeagueEntries, getSummonerByPuuid } from "../services/league.service"
import { REGION_TO_PLATFORM } from "../utils/riot-id.utils"
import { PlayerRankItem } from "./player-rank-item"

export interface PlayerRanksProps {
  puuid: string
  region: RiotRegion
}

export function PlayerRanks({ puuid, region }: PlayerRanksProps) {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<RiotLeagueEntry[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const platform = REGION_TO_PLATFORM[region]

    getSummonerByPuuid(platform, puuid)
      .then((summoner) => getLeagueEntries(platform, summoner.id))
      .then((data) => {
        if (!cancelled) setEntries(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : t("ranks.error"))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [puuid, region, t])

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("ranks.loading")}
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        {error}
      </p>
    )
  }

  if (!entries?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("ranks.empty")}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => (
        <PlayerRankItem key={`${entry.queueType}-${entry.leagueId}`} entry={entry} />
      ))}
    </div>
  )
}
