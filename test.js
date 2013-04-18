// [108, 71, 276]
var render = require('./')
var worldOrigin = [122, 72, 286]
var regionX = Math.floor((worldOrigin[0] >> 4) / 32)
var regionZ = Math.floor((worldOrigin[2] >> 4) / 32)
var regionFile = 'worlds/nyc/r.' + regionX + '.' + regionZ + '.mca'
var size = 2
var mcRegion = require('minecraft-region')
var binaryXHR = require('binary-xhr')
var fs = require('fs')

if (process.browser) {
  binaryXHR(regionFile, function(err, arraybuf) {
    loadRegion(arraybuf)
  })
} else {
  fs.readFile(regionFile, function(err, buf) {
    loadRegion(toArrayBuffer(buf))
  })
}

function loadRegion(data) {
  var regions = {}
  var types = {}
  var region = mcRegion(data, regionX, regionZ)
  console.log('loading region from file', regionFile)
  console.time('load')
  var opts = {ymin: 0, onVoxel: function(x, y, z, type, chunkX, chunkZ) {
    var regionKey = chunkX + ':' + chunkZ
    if (regions[regionKey]) regions[regionKey]++
    else regions[regionKey] = 1
    if (types[type]) types[type]++
    else types[type] = 1
  }}
  var view = render(region, opts).loadAll()
  console.timeEnd('load')
  console.log('voxels per chunk:\n', regions)
  console.log('voxel counts per type:\n', types)
}

function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length)
  var typedarray = new Uint8Array(ab)
  for (var i = 0; i < buffer.length; ++i) {
    typedarray[i] = buffer[i]
  }
  return ab
}