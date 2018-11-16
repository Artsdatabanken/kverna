const config = require("../../config")
const io = require("../../lib/io")
const log = require("log-less-fancy")()

let tre = io.lesDatafil("full_med_graf")
let mbtiles = io.lesDatafil("inn_mbtiles")

function avrund1d(num) {
  return Math.round(parseFloat(num) * 1000) / 1000
}

function avrund4d(bounds) {
  const bbox = bounds.split(",")
  const bboxjson = bbox.map(f => avrund1d(f))
  const ll = [bboxjson[1], bboxjson[0]]
  const ur = [bboxjson[3], bboxjson[2]]
  if (ll[0] > ur[0] || ll[1] > ur[1])
    throw new Error("Ugyldig bbox " + JSON.stringify(bboxjson))
  return [ll, ur]
}

// Forventer følgende katalogstruktur på tile serveren:
// /kartkategori/?/?/kode
// Dvs. at rotkatalog betraktes som klasse av data, eks. gradient eller trinn
Object.keys(mbtiles).forEach(path => {
  const parts = path.split("/")
  if (parts.length < 3) return
  const klasse = parts[1]
  const kode = parts[parts.length - 1]
  const mbtile = mbtiles[path]
  if (!tre[kode]) {
    log.warn("bbox for kode '" + kode + "', men koden eksisterer ikke")
    return
  }
  const target = tre[kode]
  if (!target.viz) target.viz = {}
  const viz = target.viz
  if (!viz[klasse]) viz[klasse] = {}
  const cv = viz[klasse]
  if (mbtile.maxzoom) {
    cv.zoom = [parseInt(mbtile.minzoom), parseInt(mbtile.maxzoom)]
  }
  if (mbtile.bounds) {
    // For now, no bounds for GeoJSON
    cv.zoom = [parseInt(mbtile.minzoom), parseInt(mbtile.maxzoom)]
    target.bbox = avrund4d(mbtile.bounds)
  }
  if (mbtile.format) cv.format = mbtile.format
})

io.skrivDatafil(__filename, tre)
