import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useTranslation } from "@/contexts/i18n"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const { t } = useTranslation()
  const { setTheme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={t("theme.toggle")}
      className={cn(
        "relative flex h-10 w-16 shrink-0 cursor-pointer items-center rounded-full border border-border bg-muted overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      tabIndex={0}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          setTheme(isDark ? "light" : "dark")
        }
      }}
    >
      {/* Thumb: círculo com ícone centralizado */}
      <span
        className={cn(
          "absolute inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 ease-out",
          isDark && "translate-x-7"
        )}
      >
        {isDark ? (
          <Moon className="size-5 shrink-0" aria-hidden />
        ) : (
          <Sun className="size-5 shrink-0" aria-hidden />
        )}
      </span>
    </button>
  )
}
