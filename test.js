var render = require('./')
var worldOrigin = [-225, 80, 50]
var regionFile = 'r.-1.0.mca'
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
  var region = mcRegion(data)
  console.log('loading region around', worldOrigin, 'with distance', size, 'from file', regionFile)
  var opts = {x: worldOrigin[0], y: worldOrigin[1], z: worldOrigin[2], size: size, ymin: 0, onVoxel: function(x, y, z, type, chunkX, chunkZ) {
    var regionKey = chunkX + ':' + chunkZ
    if (regions[regionKey]) regions[regionKey]++
    else regions[regionKey] = 1
  }}
  var view = render(region, opts)
  console.log('voxels per chunk:\n', regions)
}

function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length)
  var view = new Uint8Array(ab)
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i]
  }
  return ab
}