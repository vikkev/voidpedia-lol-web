import { useState } from "react"
import { getChampionImageUrl } from "@/lib/ddragon"
import { cn } from "@/lib/utils"

interface ChampionIconProps {
  championName: string
  size?: "sm" | "md"
  className?: string
}

const sizeClasses = {
  sm: "h-8 w-8 min-w-8 min-h-8",
  md: "h-10 w-10 min-w-10 min-h-10",
} as const

/**
 * Ícone do campeão (lazy, tamanho fixo). Otimizado para listas.
 */
export function ChampionIcon({
  championName,
  size = "sm",
  className,
}: ChampionIconProps) {
  const [failed, setFailed] = useState(false)
  const src = getChampionImageUrl(championName)

  if (failed) {
    return (
      <span
        className={cn(
          "flex items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground",
          sizeClasses[size],
          className
        )}
        title={championName}
      >
        {championName.slice(0, 2)}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      width={size === "sm" ? 32 : 40}
      height={size === "sm" ? 32 : 40}
      className={cn(
        "rounded object-cover",
        sizeClasses[size],
        className
      )}
      onError={() => setFailed(true)}
    />
  )
}
