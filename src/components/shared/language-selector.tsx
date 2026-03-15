import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocale } from "@/contexts/locale"
import { useTranslation } from "@/contexts/i18n"
import { supportedLocales } from "@/lib/i18n"

export function LanguageSelector() {
  const { locale, setLocale } = useLocale()
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="size-10" title={t("locale.label")}>
          <Languages className="size-5 shrink-0" />
          <span className="sr-only">{t("locale.label")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[min(70vh,24rem)] overflow-y-auto">
        {supportedLocales.map(({ code, name, flag }) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => setLocale(code)}
            className={locale === code ? "bg-accent" : undefined}
          >
            <span className="mr-2">{flag}</span>
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
