/** Formata duração em segundos para "Xm Ys". */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

/** Formata timestamp (ms) para data relativa ou local. */
export function formatGameTime(creationMs: number): string {
  const date = new Date(creationMs)
  const now = Date.now()
  const diff = now - creationMs
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  if (days === 0) return "Hoje"
  if (days === 1) return "Ontem"
  if (days < 7) return `${days} dias atrás`
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
}
