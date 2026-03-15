interface MatchHistoryErrorProps {
  message: string
}

export function MatchHistoryError({ message }: MatchHistoryErrorProps) {
  return (
    <div
      className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      role="alert"
    >
      {message}
    </div>
  )
}
