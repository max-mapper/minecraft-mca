var mcChunk = require('minecraft-chunk')
var blockInfo = require('minecraft-blockinfo')

module.exports = function(region, options) {
  return new RegionRenderer(region, options)
}

module.exports.getChunk = getChunk

function getChunk(x, z) {
  return [x >> 4, z >> 4]
}

function RegionRenderer(region, options) {
  this.region = region
  this.options = options
  this.load()
}

RegionRenderer.prototype.load = function() {
  var chunk, e, maxx, maxz, minx, minz, region, size, x, z, _i, _j;
  var chunkPos = getChunk(this.options.x, this.options.z)
  
  size = this.options.size * 1;
  minx = (chunkPos[0]) - size;
  minz = (chunkPos[1]) - size;
  maxx = (chunkPos[0]) + size;
  maxz = (chunkPos[1]) + size;
  for (x = _i = minx; minx <= maxx ? _i <= maxx : _i >= maxx; x = minx <= maxx ? ++_i : --_i) {
    for (z = _j = minz; minz <= maxz ? _j <= maxz : _j >= maxz; z = minz <= maxz ? ++_j : --_j) {
      region = this.region;
      if (true || this.region.hasChunk(x, z)) {
        try {
          chunk = region.getChunk(x, z);
          if (chunk != null) {
            this.loadChunk(chunk, x, z, this.options.onVoxel);
          } else {
            console.log('chunk at ' + x + ',' + z + ' is undefined');
          }
        } catch (_error) {
          e = _error;
          console.log(e.message);
          console.log(e.stack);
        }
      }
    }
  }
  return
};

RegionRenderer.prototype.loadChunk = function(chunk, chunkX, chunkZ, onVoxel) {
  var attributes, chunkSize, colorArray, count, cube, e, f, geometry, i, index, indices, left, mat, material, mesh, options, start, startedIndex, uvArray, vertexIndexArray, vertexPositionArray, verts, view, _i, _j, _k, _l, _len, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

  options = {
    nbt: chunk,
    ymin: this.options.ymin,
    showstuff: false,
    superflat: false,
    chunkX: chunkX,
    chunkZ: chunkZ
  };
  view = mcChunk(options);
  var voxels = []
  try {
    view.extractChunk(function(x, y, z, type) {
      onVoxel(x, y, z, type, chunkX, chunkZ)
    });
  } catch (_error) {
    e = _error;
    console.log("Error in extractChunk");
    console.log(e.message);
    console.log(e.stack);
  }
  
};