import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "@/contexts/i18n"
import type { RiotMatch } from "../types"
import { getMatchHistoryCached } from "../services/match-history-cache"
import { getMatchHistory } from "../services/match.service"
import { MatchHistoryItem } from "./match-history-item"
import { MatchHistoryLoading } from "./match-history-loading"
import { MatchHistoryError } from "./match-history-error"
import { MatchHistoryEmpty } from "./match-history-empty"
import { toast } from "@/lib/toast"

const PAGE_SIZE = 10

interface MatchHistoryProps {
  puuid: string
  region: "americas" | "europe" | "asia"
}

export function MatchHistory({ puuid, region }: MatchHistoryProps) {
  const { t } = useTranslation()
  const [matches, setMatches] = useState<RiotMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const next = await getMatchHistory(
        puuid,
        region,
        PAGE_SIZE,
        matches.length
      )
      setMatches((prev) =>
        [...prev, ...next].sort(
          (a, b) => (b.info.gameCreation ?? 0) - (a.info.gameCreation ?? 0)
        )
      )
      setHasMore(next.length === PAGE_SIZE)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("matchHistory.error")
      )
    } finally {
      setLoadingMore(false)
    }
  }, [puuid, region, matches.length, hasMore, loadingMore, t])

  useEffect(() => {
    let cancelled = false
    setMatches([])
    setHasMore(true)
    setError(null)
    setLoading(true)
    getMatchHistoryCached(puuid, region, PAGE_SIZE)
      .then((data) => {
        if (!cancelled) setMatches(data)
        if (!cancelled) setHasMore(data.length === PAGE_SIZE)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("matchHistory.error"))
          toast.error(
            err instanceof Error ? err.message : t("matchHistory.error")
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [puuid, region, t])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || loading || loadingMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: "200px", threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, loadingMore, loadMore])

  if (loading) return <MatchHistoryLoading />
  if (error) return <MatchHistoryError message={error} />
  if (matches.length === 0) return <MatchHistoryEmpty />

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-medium text-foreground">
        {t("matchHistory.title")}
      </h3>
      <ul className="flex flex-col gap-2">
        {matches.map((match) => (
          <MatchHistoryItem
            key={match.metadata.matchId}
            match={match}
            puuid={puuid}
            region={region}
          />
        ))}
      </ul>
      <div ref={sentinelRef} className="min-h-4" aria-hidden="true" />
      {loadingMore && (
        <div className="py-2 text-center text-sm text-muted-foreground">
          {t("matchHistory.loading")}
        </div>
      )}
    </div>
  )
}
