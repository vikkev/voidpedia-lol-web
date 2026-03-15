import { useTranslation } from "@/contexts/i18n"
import { usePlayerSearch } from "@/contexts/player-search"
import { MatchHistory } from "./match-history"

/**
 * Seção da home que exibe o jogador salvo no cache e suas partidas.
 * O header serve para buscar outro jogador (que passa a ser o salvo).
 */
export function SavedPlayerSection() {
  const { t } = useTranslation()
  const { player, region } = usePlayerSearch()

  if (!player) {
    return (
      <section
        className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground"
        aria-label={t("home.savedPlayer.title")}
      >
        <h2 className="mb-2 font-display text-base font-semibold text-foreground">
          {t("home.savedPlayer.title")}
        </h2>
        <p>{t("home.savedPlayer.empty")}</p>
      </section>
    )
  }

  return (
    <section
      className="flex flex-col gap-6"
      aria-label={t("home.savedPlayer.title")}
    >
      <h2 className="font-display text-base font-semibold text-foreground">
        {t("home.savedPlayer.title")}
      </h2>
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
        <p className="font-medium text-foreground">
          {player.gameName}#{player.tagLine}
        </p>
      </div>
      <MatchHistory puuid={player.puuid} region={region} />
    </section>
  )
}
