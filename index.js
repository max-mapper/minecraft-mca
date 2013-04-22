var mcChunk = require('minecraft-chunk')

module.exports = RegionRenderer

module.exports.chunkPosition = chunkPosition

function chunkPosition(x, z) {
  return [x >> 4, z >> 4]
}

function RegionRenderer(region, options) {
  if (!(this instanceof RegionRenderer)) return new RegionRenderer(region, options)
  this.region = region
  this.options = options
}

RegionRenderer.prototype.positionBounds = function() {
  var cb = this.chunkBounds()
  var minx = cb[0] << 4
  var minz = cb[2] << 4
  var maxx = (cb[1] + 1 << 4) - 1
  var maxz = (cb[3] + 1 << 4) - 1
  return [[minx, 0, minz], [maxx, 256, maxz]]
}

RegionRenderer.prototype.chunkBounds = function() {
  var x = +this.region.x
  var z = +this.region.z
  var minx = x * 32
  var minz = z * 32
  var maxx = (x + 1) * 32 - 1
  var maxz = (z + 1) * 32 - 1
  return [minx, maxx, minz, maxz]
}

RegionRenderer.prototype.loadAll = function() {
  var chunks = this.chunkBounds()
  for (var x = chunks[0]; x <= chunks[1]; x++ ) {
    for (var z = chunks[2]; z <= chunks[3]; z++ ) {
      this.loadChunk(x, z)
    }
  }
}

RegionRenderer.prototype.loadNearby = function(pos, size) {
  var x = pos[0]
  var z = pos[2]
  var chunkPos = chunkPosition(x, z)
  var minx = (chunkPos[0]) - size
  var minz = (chunkPos[1]) - size
  var maxx = (chunkPos[0]) + size
  var maxz = (chunkPos[1]) + size
  for (var x = minx; x <= maxx; x++ ) {
    for (var z = minz; z <= maxz; z++ ) {
      this.loadChunk(x, z)
    }
  }
}

RegionRenderer.prototype.initializeChunk = function(chunk, chunkX, chunkZ) {
  var options = {
    nbt: chunk,
    ymin: this.options.ymin,
    showstuff: false,
    superflat: false,
    chunkX: chunkX,
    chunkZ: chunkZ
  }
  return mcChunk(options)
}

RegionRenderer.prototype.loadChunk = function(chunkX, chunkZ) {
  var self = this
  var region = this.region
  var hasChunk = !this.region.outOfBounds(chunkX, chunkZ)
  if (hasChunk) {
    var chunk = region.getChunk(chunkX, chunkZ)
    if (chunk != null) {
      var view = this.initializeChunk(chunk, chunkX, chunkZ)
      var voxels = []
      view.extractChunk(function(x, y, z, block) {
        self.options.onVoxel(x, y, z, block, chunkX, chunkZ)
      })
    } else {
      return false
    }
  }
}