var mcChunk = require('minecraft-chunk')
var blockInfo = require('minecraft-blockinfo')

function mod (num, n) { return ((num % n) + n) % n }

module.exports = function(region, options) {
  return new RegionRenderer(region, options)
}

module.exports.mcCoordsToWorld = mcCoordsToWorld

function mcCoordsToWorld(x, y, z) {
  var chunkX, chunkZ, posX, posZ, ret, verts;

  chunkX = mod(Math.floor(x / 16), 32)
  chunkZ = mod(Math.floor(z / 16), 32)
  posX = mod(mod(x, 32 * 16), 16)
  posZ = mod(mod(z, 32 * 16), 16)
  posX = Math.abs(posX);
  posZ = Math.abs(posZ);
  chunkX = Math.abs(chunkX);
  chunkZ = Math.abs(chunkZ);
  verts = mcChunk.calcPoint([posX, y, posZ], {
    chunkX: chunkX,
    chunkZ: chunkZ
  });
  ret = {
    x: verts[0],
    y: verts[1],
    z: verts[2],
    chunkX: chunkX,
    chunkZ: chunkZ
  };
  return ret;
};

function RegionRenderer(region, options) {
  this.region = region
  this.options = options
  this.load()
}

RegionRenderer.prototype.load = function() {
  var camPos, chunk, e, maxx, maxz, minx, minz, region, size, startX, startZ, x, z, _i, _j;
  startX = this.options.x * 1;
  startZ = this.options.z * 1;
  camPos = mcCoordsToWorld(startX, this.options.y * 1, startZ);
  size = this.options.size * 1;
  minx = camPos.chunkX - size;
  minz = camPos.chunkZ - size;
  maxx = camPos.chunkX + size;
  maxz = camPos.chunkZ + size;
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