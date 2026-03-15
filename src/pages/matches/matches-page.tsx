import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useTranslation } from "@/contexts/i18n"
import type { RiotRegion } from "./types"
import { getMatchDetail } from "./services/match.service"
import { MatchDetail } from "./components/match-detail"
import { toast } from "@/lib/toast"

const DEFAULT_REGION: RiotRegion = "americas"

export function MatchesPage() {
  const { t } = useTranslation()
  const { id: matchId } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const region = (searchParams.get("region") as RiotRegion) || DEFAULT_REGION
  const viewedPlayerPuuid = searchParams.get("puuid") ?? undefined

  const [match, setMatch] = useState<Awaited<ReturnType<typeof getMatchDetail>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!matchId) {
      const msg = t("matches.idRequired")
      toast.error(msg)
      queueMicrotask(() => {
        setLoading(false)
        setError(msg)
      })
      return
    }
    let cancelled = false
    queueMicrotask(() => {
      setLoading(true)
      setError(null)
    })
    getMatchDetail(matchId, region)
      .then((data) => {
        if (!cancelled) setMatch(data)
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : t("matches.loadError")
          setError(msg)
          toast.error(msg)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [matchId, region, t])

  if (loading) {
    return (
      <div className="flex flex-col p-6">
        <p className="text-sm text-muted-foreground">{t("matches.loading")}</p>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <div
          className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error ?? t("matches.notFound")}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <MatchDetail match={match} viewedPlayerPuuid={viewedPlayerPuuid} />
    </div>
  )
}
