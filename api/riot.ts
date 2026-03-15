import type { VercelRequest, VercelResponse } from "@vercel/node"

const REGION_BASE: Record<string, string> = {
  americas: "https://americas.api.riotgames.com",
  europe: "https://europe.api.riotgames.com",
  asia: "https://asia.api.riotgames.com",
}

/**
 * Proxy para a API Riot. A chave fica só em RIOT_API_KEY no Vercel (env),
 * nunca no repositório nem no front.
 *
 * Front usa: VITE_RIOT_API_PROXY = "https://seu-dominio.vercel.app/api/riot"
 * Rewrite no vercel.json manda /api/riot/* para cá com ?path=...
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const key = process.env.RIOT_API_KEY
  if (!key) {
    res.status(500).json({
      error: "RIOT_API_KEY not configured. Set it in Vercel project environment.",
    })
    return
  }

  // Path: do query (rewrite envia ?path=account/v1/...) ou da URL
  let riotPath: string
  const pathFromQuery = req.query.path
  if (Array.isArray(pathFromQuery) && pathFromQuery.length > 0) {
    riotPath = "/" + pathFromQuery.join("/")
  } else if (typeof pathFromQuery === "string" && pathFromQuery) {
    riotPath = pathFromQuery.startsWith("/") ? pathFromQuery : "/" + pathFromQuery
  } else if (req.url) {
    const pathname = req.url.split("?")[0]
    const prefix = "/api/riot"
    riotPath = pathname.startsWith(prefix) ? pathname.slice(prefix.length) || "/" : "/"
  } else {
    riotPath = "/"
  }

  // Normaliza: se o front mandar /riot/account/... (build antigo), tira o /riot/ e aplica a regra abaixo.
  if (riotPath.startsWith("/riot/")) riotPath = riotPath.slice(6)
  // Paths da Riot: /riot/account/..., /lol/match/... O front manda /account/... e /match/...; a gente coloca o prefixo.
  if (riotPath.startsWith("/account")) riotPath = "/riot" + riotPath
  else if (riotPath.startsWith("/match")) riotPath = "/lol" + riotPath

  const region = (req.query.region as string) || "americas"
  const base = REGION_BASE[region]
  if (!base) {
    res.status(400).json({ error: "Invalid region" })
    return
  }

  const search = new URLSearchParams(req.query as Record<string, string>)
  search.delete("region")
  search.delete("path")
  const qs = search.toString()
  const url = qs ? `${base}${riotPath}?${qs}` : `${base}${riotPath}`

  res.setHeader("X-Proxy-Target", url)

  try {
    const response = await fetch(url, {
      headers: { "Accept": "application/json", "X-Riot-Token": key },
    })
    const data = await response.json().catch(() => ({}))
    res.status(response.status).json(data)
  } catch (err) {
    res.status(502).json({
      error: err instanceof Error ? err.message : "Proxy request failed",
    })
  }
}
