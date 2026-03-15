import { useTranslation } from "@/contexts/i18n"

export function MatchHistoryEmpty() {
  const { t } = useTranslation()
  return (
    <p className="text-sm text-muted-foreground">
      {t("matchHistory.empty")}
    </p>
  )
}
