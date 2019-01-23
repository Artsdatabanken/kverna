const config = require("../../config")
const io = require("../../lib/io")
const log = require("log-less-fancy")()
const typesystem = require("@artsdatabanken/typesystem")

const tre = io.lesBuildfil("metabase")
const index = {}

function push(hit, score, text) {
  if (!text) return
  if (!index[hit.key]) index[hit.key] = { title: hit.title }
  const item = index[hit.key]
  score = parseInt(100 * score)
  if (!item[score]) item[score] = []
  item[score].push(text)
}

function overordnet(hit, array, score) {
  if (!array || array.length < 2) return
  const node = array.shift()
  if (!node) return
  push(hit, score, node.kode)
  push(hit, score, node.tittel.nb)
  overordnet(hit, array, score * 0.9)
}

Object.keys(tre).forEach(kode => {
  const node = tre[kode]
  const hit = { key: node.url, title: node.tittel.nb }
  push(hit, 1.0, node.kode)
  push(hit, 1.0, node.tittel.nb)
  push(hit, 0.5, node.nivå)
  push(hit, 0.7, node.ingress)
  overordnet(hit, node.overordnet, 0.7)
  node.graf &&
    node.graf.forEach(gn => {
      push(hit, 0.3, gn.type)
      gn.noder.forEach(gnc => {
        push(hit, 0.7, gnc.kode)
        push(hit, 0.7, gnc.tittel.nb)
      })
    })
})

io.skrivDatafil(__filename, index)
