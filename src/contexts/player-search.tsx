/* eslint-disable react-refresh/only-export-components */
"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { RiotAccount, RiotRegion } from "@/pages/home/types"
import { getPlayer } from "@/pages/home/services/player.service"
import { useTranslation } from "@/contexts/i18n"
import { toast } from "@/lib/toast"
import { getCachedLastPlayer, setCachedLastPlayer } from "@/lib/cache/last-player"

type PlayerSearchState = {
  gameName: string
  setGameName: (v: string) => void
  tagLine: string
  setTagLine: (v: string) => void
  region: RiotRegion
  setRegion: (v: RiotRegion) => void
  player: RiotAccount | null
  error: string | null
  loading: boolean
  search: (e: React.FormEvent) => Promise<void>
}

const PlayerSearchContext = createContext<PlayerSearchState | null>(null)

export function PlayerSearchProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [gameName, setGameName] = useState("")
  const [tagLine, setTagLine] = useState("")
  const [region, setRegion] = useState<RiotRegion>("americas")
  const [player, setPlayer] = useState<RiotAccount | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cached = getCachedLastPlayer()
    if (cached) {
      setGameName(cached.gameName)
      setTagLine(cached.tagLine)
      setRegion(cached.region)
      setPlayer(cached.player)
    }
  }, [])

  const search = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPlayer(null)

    const name = gameName.trim()
    const tag = tagLine.trim()
    if (!name) {
      toast.error(t("playerSearch.error.nameRequired"))
      return
    }
    if (!tag) {
      toast.error(t("playerSearch.error.tagRequired"))
      return
    }

    setLoading(true)
    try {
      const data = await getPlayer(name, tag, region)
      setPlayer(data)
      setCachedLastPlayer({ gameName: name, tagLine: tag, region, player: data })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("playerSearch.error.fetch"))
    } finally {
      setLoading(false)
    }
  }, [gameName, tagLine, region, t])

  const value: PlayerSearchState = {
    gameName,
    setGameName,
    tagLine,
    setTagLine,
    region,
    setRegion,
    player,
    error,
    loading,
    search,
  }

  return (
    <PlayerSearchContext.Provider value={value}>
      {children}
    </PlayerSearchContext.Provider>
  )
}

export function usePlayerSearch(): PlayerSearchState {
  const ctx = useContext(PlayerSearchContext)
  if (!ctx) {
    throw new Error("usePlayerSearch must be used within PlayerSearchProvider")
  }
  return ctx
}
