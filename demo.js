var textures = "http://commondatastorage.googleapis.com/voxeltextures/"
var materials = [['grass', 'grass', 'grass'], 'stone', 'lava2', 'iron', 'gravel', 'coal', 'dirt', 'water2', 'wood', 'cobble', 'leaves', 'log', 'mossy']
// var worldOrigin = [0, 67, 320]
// var worldOrigin = [-61, 169, 329]
var worldOrigin = [225, 80, 50]
var regionFile = 'r.-1.0.mca'

var render = require('./')
var mcRegion = require('minecraft-region')
var fs = require('fs')
var binaryXHR = require('binary-xhr')
var fly = require('voxel-fly')
var game = require('voxel-hello-world')({
  generate: function(x, y, z) { return 0; },
  texturePath: './textures/',
  playerSkin: textures + 'player.png',
  chunkDistance: 5,
  arrayType: Float32Array,
  worldOrigin: worldOrigin,
  materials: materials
})

window.game = game
var makeFly = fly(game)
makeFly(game.controls.target()).startFlying()

var wc = render.mcCoordsToWorld(worldOrigin[0], worldOrigin[1], worldOrigin[2])
game.controls.target().avatar.position.copy({x: wc.x, y: wc.y, z: wc.z})

binaryXHR(regionFile, function(err, data) {
  if (err) return console.error(err)
  var region = mcRegion(data)
  var opts = {x: worldOrigin[0], y: worldOrigin[1], z: worldOrigin[2], size: game.chunkDistance, ymin: 0, onVoxel: function(x, y, z, type, offsetX, offsetZ) {
    game.setBlock([(offsetX * 16) + x, y, (offsetZ * 16) + z], type)
  }}
  var view = render(region, opts)
})
