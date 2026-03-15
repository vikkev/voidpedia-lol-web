import { useState } from "react"
import type { RiotAccount, RiotRegion } from "../types"
import { Button } from "@/components/ui/button"
import { TextInput } from "@/components/ui/inputs/text-input"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/contexts/i18n"
import { getPlayer } from "../services/player.service"
import { parseRiotId, REGIONS } from "../utils/riot-id.utils"
import { MatchHistory } from "./match-history"
import { toast } from "@/lib/toast"

export function PlayerSearch() {
  const { t } = useTranslation()
  const [riotIdInput, setRiotIdInput] = useState("")
  const [region, setRegion] = useState<RiotRegion>("americas")
  const [player, setPlayer] = useState<RiotAccount | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPlayer(null)

    const { gameName, tagLine } = parseRiotId(riotIdInput)
    if (!gameName.trim()) {
      toast.error(t("playerSearch.error.nameRequired"))
      return
    }
    if (!tagLine.trim()) {
      toast.error(t("playerSearch.error.tagRequired"))
      return
    }

    setLoading(true)
    try {
      const data = await getPlayer(gameName, tagLine, region)
      setPlayer(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("playerSearch.error.fetch"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex max-w-md flex-col gap-4">
      <h2 className="text-base font-medium text-foreground">
        Buscar jogador (LoL)
      </h2>
      <p className="text-sm text-muted-foreground">
        Use o Riot ID no formato <strong>Nome#Tag</strong> (ex: Faker#KR1).
      </p>

      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <TextInput
          type="text"
          value={riotIdInput}
          onChange={(e) => setRiotIdInput(e.target.value)}
          placeholder="Nome#Tag"
          disabled={loading}
          autoComplete="off"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value as RiotRegion)}
          disabled={loading}
          className={cn(
            "h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:opacity-50"
          )}
        >
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {t(r.labelKey)}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={loading}>
          {loading ? "Buscando…" : "Buscar"}
        </Button>
      </form>

      {player ? (
        <>
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
            <p className="font-medium text-foreground">
              {player.gameName}#{player.tagLine}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground break-all">
              PUUID: {player.puuid}
            </p>
          </div>
          <MatchHistory puuid={player.puuid} region={region} />
        </>
      ) : (
        <div
          className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground"
          aria-hidden="true"
        >
          Digite um Riot ID acima e clique em Buscar para ver o histórico de
          matches.
        </div>
      )}
    </div>
  )
}
