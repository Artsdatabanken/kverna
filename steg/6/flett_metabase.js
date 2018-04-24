const config = require("../../config")
const koder = require("../../lib/koder")
const io = require("../../lib/io")
const log = require("log-less-fancy")()

const r = {}

function flettAttributter(o) {
  for (let key of Object.keys(o)) {
    r[key] = Object.assign({}, r[key], o[key])
  }
}

function flett(filename) {
  var data = io.lesDatafil(filename)
  flettAttributter(data)
}
function flettKildedata(filename) {
  var data = io.lesKildedatafil(filename)
  flettAttributter(data)
}

function flettHvisEksisterer(filename) {
  var data = io.lesDatafil(filename)
  for (let key of Object.keys(data)) {
    if (r[key]) Object.assign(r[key], data[key])
  }
}

let counts = {}

function settHvisEksisterer(kilde, mål, nøkkel) {
  if (!kilde[nøkkel]) return
  mål[nøkkel] = kilde[nøkkel]
}

function finnForeldre(kode) {
  if (kode === config.kodesystem.rotkode) return []
  const segs = koder.splittKode(kode)
  if (segs.length <= 1) return [config.kodesystem.rotkode]
  const len = segs[segs.length - 1].length
  kode = kode.substring(0, kode.length - len)
  while (kode.length > 0) {
    if (kode in r) return [kode]
    kode = kode.substring(0, kode.length - 1)
  }
  return [config.kodesystem.rotkode]
}

function kobleForeldre() {
  for (let key of Object.keys(r)) {
    const node = r[key]
    if (!node.foreldre) node.foreldre = finnForeldre(key)
  }
}

flettKildedata("annen_kode")
flettKildedata("VV_naturvernområde")
flett("VV_naturvernområde")
flett("inn_ao_fylke")
flett("inn_ao_kommune")
flettKildedata("OR_organisasjon")
flett("AR_diagnostisk_art")
flett("NA_hovedtype")
flett("NA_MI_liste")
flett("MI_variasjon")
flett("AR_taxon")
flett("NA_prosedyrekategori")
flett("NA_definisjonsgrunnlag")
flettHvisEksisterer("bbox.json")

kobleForeldre()

for (let key of Object.keys(r)) {
  const node = r[key]
  if (!node.se) {
    if (!r[key].tittel) log.warn("Mangler tittel: ", node)
    if (r[key].kode) log.warn("Har kode: ", key)
  }
}

const hash = {}
Object.keys(r).forEach(key => {
  const node = r[key]
  if (!node.se) {
    if (!node.tittel) console.log(node)
    const tittel = node.tittel.nb || node.tittel.la
    if (!hash[tittel]) hash[tittel] = []
    else hash[tittel].push(key)
  }
})

io.skrivDatafil(__filename, r)
