import type { VercelRequest, VercelResponse } from "@vercel/node"

const REGION_BASE: Record<string, string> = {
  americas: "https://americas.api.riotgames.com",
  europe: "https://europe.api.riotgames.com",
  asia: "https://asia.api.riotgames.com",
}

/** Platform bases for Summoner v4 / League v4 (by-puuid, by-summoner). */
const PLATFORM_BASE: Record<string, string> = {
  br1: "https://br1.api.riotgames.com",
  na1: "https://na1.api.riotgames.com",
  la1: "https://la1.api.riotgames.com",
  la2: "https://la2.api.riotgames.com",
  euw1: "https://euw1.api.riotgames.com",
  eun1: "https://eun1.api.riotgames.com",
  tr1: "https://tr1.api.riotgames.com",
  ru: "https://ru.api.riotgames.com",
  jp1: "https://jp1.api.riotgames.com",
  kr: "https://kr.api.riotgames.com",
  oc1: "https://oc1.api.riotgames.com",
}

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With")
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ✅ Set CORS first, before ANY early returns
  setCors(res)

  if (req.method === "OPTIONS") {
    res.status(204).end()
    return
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const key = process.env.RIOT_API_KEY
  if (!key) {
    // ✅ Log all env keys available (never log values) to debug missing vars
    console.error("RIOT_API_KEY missing. Available env keys:", Object.keys(process.env))
    res.status(500).json({ error: "RIOT_API_KEY not configured" })
    return
  }

  const { region = "americas", platform: platformParam, ...query } = req.query
  const regionStr = Array.isArray(region) ? region[0] : region
  const platformStr = Array.isArray(platformParam) ? platformParam[0] : platformParam

  // ✅ Strip /api/riot prefix reliably regardless of query string
  const rawPath = req.url ?? ""
  let path = rawPath.replace(/^\/api\/riot/, "").split("?")[0]

  // Summoner v4 and League v4 use platform; everything else uses region
  const usePlatform = /^\/lol\/(summoner|league)\//.test(path)
  const base = usePlatform && platformStr && PLATFORM_BASE[platformStr]
    ? PLATFORM_BASE[platformStr]
    : REGION_BASE[regionStr]

  if (!base) {
    res.status(400).json({
      error: usePlatform ? `Invalid platform: ${platformStr}` : `Invalid region: ${regionStr}`,
    })
    return
  }

  // Normalize Riot API path prefixes
  if (path.startsWith("/account")) path = "/riot" + path
  if (path.startsWith("/match"))   path = "/lol" + path

  // ✅ Build query params cleanly, excluding 'region' which is our own param
  const search = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (k === "region" || k === "platform") continue
    if (Array.isArray(v)) v.forEach(val => search.append(k, val))
    else if (v != null) search.set(k, v)
  }

  const url = `${base}${path}?${search}`
  console.log("Proxying to:", url)

  try {
    const response = await fetch(url, {
      headers: {
        "X-Riot-Token": key,
        "Accept": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(`Riot API error ${response.status}:`, data)
    }

    res.setHeader("Cache-Control", "s-maxage=60")
    res.status(response.status).json(data)
  } catch (error) {
    console.error("Proxy failed:", error)
    res.status(500).json({ error: "Proxy failed" })
  }
}