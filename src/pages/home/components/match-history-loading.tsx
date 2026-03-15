import { useTranslation } from "@/contexts/i18n"

export function MatchHistoryLoading() {
  const { t } = useTranslation()
  return (
    <div className="text-sm text-muted-foreground">
      {t("matchHistory.loading")}
    </div>
  )
}
