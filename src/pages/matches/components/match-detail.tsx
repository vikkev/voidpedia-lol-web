import type { MatchParticipant, RiotMatch } from "../types"
import { MatchDetailHeader } from "./match-detail-header"
import { ParticipantCard } from "./participant-card"

const TEAM_BLUE = 100
const TEAM_RED = 200

function splitParticipantsByTeam(participants: MatchParticipant[]): {
  team1: MatchParticipant[]
  team2: MatchParticipant[]
} {
  const team1 = participants.filter((p) => p.teamId === TEAM_BLUE)
  const team2 = participants.filter((p) => p.teamId === TEAM_RED)
  if (team1.length > 0 && team2.length > 0) {
    return { team1, team2 }
  }
  const mid = Math.ceil(participants.length / 2)
  return { team1: participants.slice(0, mid), team2: participants.slice(mid) }
}

export interface MatchDetailProps {
  match: RiotMatch
  /** PUUID do jogador que está sendo consultado — o card dele será destacado */
  viewedPlayerPuuid?: string
}

export function MatchDetail({ match, viewedPlayerPuuid }: MatchDetailProps) {
  const { info, metadata } = match
  const { team1, team2 } = splitParticipantsByTeam(info.participants)

  return (
    <div className="flex flex-col gap-4">
      <MatchDetailHeader
        matchId={metadata.matchId}
        gameMode={info.gameMode}
        gameDuration={info.gameDuration}
        gameCreation={info.gameCreation}
      />
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Participantes
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <section>
            <h4 className="mb-2 text-xs font-medium text-muted-foreground">
              Time 1
            </h4>
            <ul className="flex flex-col gap-2">
              {team1.map((p) => (
                <ParticipantCard
                  key={p.puuid}
                  participant={p}
                  isViewedPlayer={viewedPlayerPuuid != null && p.puuid === viewedPlayerPuuid}
                />
              ))}
            </ul>
          </section>
          <section>
            <h4 className="mb-2 text-xs font-medium text-muted-foreground">
              Time 2
            </h4>
            <ul className="flex flex-col gap-2">
              {team2.map((p) => (
                <ParticipantCard
                  key={p.puuid}
                  participant={p}
                  isViewedPlayer={viewedPlayerPuuid != null && p.puuid === viewedPlayerPuuid}
                />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
