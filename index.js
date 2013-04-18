var mcChunk = require('minecraft-chunk')

module.exports = function(region, options) {
  return new RegionRenderer(region, options)
}

module.exports.chunkPosition = chunkPosition

function chunkPosition(x, z) {
  return [x >> 4, z >> 4]
}

function RegionRenderer(region, options) {
  this.region = region
  this.options = options
}

RegionRenderer.prototype.loadAll = function() {
  var x = this.region.x
  var z = this.region.z
  var minx = x * 32
  var minz = z * 32
  var maxx = (x + 1) * 32 - 1
  var maxz = (z + 1) * 32 - 1
  for (var x = minx; x <= maxx; x++ ) {
    for (var z = minz; z <= maxz; z++ ) {
      this.loadChunk(x, z)
    }
  }
}

RegionRenderer.prototype.loadNearby = function(x, z, size) {
  var chunkPos = chunkPosition(x, z)
  var minx = (chunkPos[0]) - size;
  var minz = (chunkPos[1]) - size;
  var maxx = (chunkPos[0]) + size;
  var maxz = (chunkPos[1]) + size;
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
  };
  return mcChunk(options)
}

RegionRenderer.prototype.loadChunk = function(chunkX, chunkZ, onVoxel) {
  var self = this
  var region = this.region;
  if (true || this.region.hasChunk(chunkX, chunkZ)) {
    try {
      var chunk = region.getChunk(chunkX, chunkZ);
      if (chunk != null) {
        var view = this.initializeChunk(chunk, chunkX, chunkZ)
        var voxels = []
        try {
          view.extractChunk(function(x, y, z, type) {
            self.options.onVoxel(x, y, z, type, chunkX, chunkZ)
          });
        } catch (_error) {
          var e = _error;
          console.log("Error in extractChunk");
          console.log(e.message);
          console.log(e.stack);
        }
      } else {
        console.log('chunk at ' + chunkX + ',' + chunkZ + ' is undefined');
      }
    } catch (_error) {
      e = _error;
      console.log(e.message);
      console.log(e.stack);
    }
  }
};