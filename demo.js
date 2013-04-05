var textures = "http://commondatastorage.googleapis.com/voxeltextures/"
var materials = [['grass', 'grass', 'grass'], 'stone', 'lava2', 'iron', 'gravel', 'coal', 'dirt', 'water2', 'wood', 'cobble', 'leaves', 'log', 'mossy']
var fly = require('voxel-fly')
var game = require('voxel-hello-world')({
  generate: function() { return 0 },
  texturePath: './textures/',
  playerSkin: textures + 'player.png',
  chunkDistance: 2,
  arrayType: Float32Array,
  worldOrigin: [172, 67, 189],
  materials: materials
})

window.game = game
var makeFly = fly(game)
makeFly(game.controls.target())

var playerPos = {x: 172, y: 67, z: 189}
game.controls.target().avatar.position.copy(playerPos)

var render = require('./')
var mcRegion = require('minecraft-region')
var fs = require('fs')
var binaryXHR = require('binary-xhr')
binaryXHR('r.0.0.mca', function(err, data) {
  if (err) return console.error(err)
  var region = mcRegion(data)
  var opts = {x: playerPos.x, y: playerPos.y, z: playerPos.z, size: game.chunkDistance, ymin: 0, onVoxel: function(x, y, z, type, offsetX, offsetZ) {
    game.setBlock([(offsetX * 16) + x, y, (offsetZ * 16) + z], type)
  }}
  var view = render(region, opts)
})
