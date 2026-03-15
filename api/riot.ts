import type { VercelRequest, VercelResponse } from "@vercel/node"

const REGION_BASE: Record<string, string> = {
  americas: "https://americas.api.riotgames.com",
  europe: "https://europe.api.riotgames.com",
  asia: "https://asia.api.riotgames.com",
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

  const { region = "americas", ...query } = req.query
  const regionStr = Array.isArray(region) ? region[0] : region
  const base = REGION_BASE[regionStr]

  if (!base) {
    res.status(400).json({ error: `Invalid region: ${regionStr}` })
    return
  }

  // ✅ Strip /api/riot prefix reliably regardless of query string
  const rawPath = req.url ?? ""
  let path = rawPath.replace(/^\/api\/riot/, "").split("?")[0]

  // Normalize Riot API path prefixes
  if (path.startsWith("/account")) path = "/riot" + path
  if (path.startsWith("/match"))   path = "/lol" + path

  // ✅ Build query params cleanly, excluding 'region' which is our own param
  const search = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (k === "region") continue
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