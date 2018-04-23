const io = require("../../lib/io")
const config = require("../../config")
const { erKartleggingsnivå, capitalizeTittel } = require("../../lib/koder")

let koder = io.lesDatafil("inn_mi")

function kodefix(kode) {
  if (!kode) return kode
  kode = kode.toUpperCase()
  if (kode.indexOf("BESYS") === 0)
    return kode.replace("BESYS", "BS_").replace("BS_0", "BS")
  if (kode === "LKM") return "MI"
  if ("0123456789".indexOf(kode[0]) < 0) return "MI_" + kode
  return "BS_" + kode
}

let kodeliste = {}

function importerKoder() {
  const mineKoder = {}
  for (let key of Object.keys(koder)) {
    const node = koder[key]
    const kode = kodefix(node.Kode.Id)
    const forelder = kodefix(node.OverordnetKode.Id || null)
    const tittel = capitalizeTittel(node.Navn)
    let o = { tittel: { nb: tittel } }
    o.foreldre = forelder ? [forelder] : []
    mineKoder[kode] = o
  }
  return mineKoder
}

const imp = importerKoder()
io.skrivDatafil(__filename, imp)
