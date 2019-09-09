const { io } = require("lastejobb")
const log = require("log-less-fancy")()
const typesystem = require("@artsdatabanken/typesystem")

let slettet_fordi_mangler_bbox = []
let tre = io.lesDatafil("metabase_kart")
let hierarki = io.lesDatafil("kodehierarki")
const barnAv = hierarki.barn

fjernKoderSomIkkeHarData(tre)
//fjernRelasjonTilKoderSomIkkeHarData(tre)

log.info("Mangler bbox for " + slettet_fordi_mangler_bbox.length + " koder")
io.skrivDatafil(__filename, tre)
io.skrivDatafil("mangler_data", slettet_fordi_mangler_bbox)

function fjernKoderSomIkkeHarData(data) {
  Object.keys(data).forEach(kode => {
    const node = data[kode]
    node.kode = kode
    if (!harKartdata(kode)) {
      delete data[kode]
      slettet_fordi_mangler_bbox.push(kode)
    }
  })
}

function hasProperty(tree, key) {
  if (Array.isArray(tree)) {
    for (let item of tree) if (hasProperty(item, key)) return true
    return false
  }
  if (tree[key]) return true
  for (let o of Object.values(tree)) if (hasProperty(o, key)) return true
  return false
}

function harKartdata(kode) {
  const node = tre[kode]
  if (!node) return false
  // Ta med alt som har relasjoner
  const x = node.kart.format && hasProperty(node.kart.format, "url")
  if (kode.indexOf("AR-") === 0) debugger
  if (node.kart.format && hasProperty(node.kart.format, "url")) return true
  if (node.gradient && Object.keys(node.gradient).length > 0) return true
  if (harRelasjon(node.graf)) return true
  const visAlltid = ["OR"]
  if (visAlltid.includes(kode)) return true
  if (kode === typesystem.rotkode) return true
  if (kode.indexOf("AO") === 0) return true
  if (kode.indexOf("SN") === 0) return true
  if (kode.indexOf("RL") === 0) return true
  if (kode.indexOf("VV") === 0) return true
  if (kode.indexOf("NN-NA-BS-8") === 0) return true

  return harBarnMedKartdata(node)
}

function harRelasjon(graf) {
  if (!graf) return false
  if (Object.keys(graf).length !== 1) return true
  return graf[0].type !== "Datakilde"
}

function harBarnMedKartdata(node) {
  const barn = barnAv[node.kode]
  if (!barn) return false
  for (const kode of barn) if (harKartdata(kode)) return true
  return false
}
