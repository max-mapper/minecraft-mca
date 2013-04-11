var render = require('./')
var mcRegion = require('minecraft-region')
var fs = require('fs')
var binaryXHR = require('binary-xhr')
var fly = require('voxel-fly')

var textures = "http://commondatastorage.googleapis.com/voxeltextures/"
var materials = [['grass', 'grass', 'grass'], 'stone', 'lava2', 'iron', 'gravel', 'coal', 'dirt', 'water2', 'wood', 'cobble', 'leaves', 'log', 'mossy']
var pos = [-86, 37, 233]
var regionFile = 'r.-1.0.mca'

var game = require('voxel-hello-world')({
  generate: function(x, y, z) { return 0; },
  texturePath: './textures/',
  playerSkin: textures + 'player.png',
  chunkDistance: 2,
  arrayType: Float32Array,
  worldOrigin: pos,
  materials: materials
})

window.game = game // for console debugging
var makeFly = fly(game)
makeFly(game.controls.target()).startFlying()

game.controls.target().avatar.position.copy({x: pos[0], y: pos[1], z: pos[2]})

game.once('tick', function() {
  binaryXHR(regionFile, function(err, data) {
    if (err) return console.error(err)
    var region = mcRegion(data)
    var opts = {x: pos[0], y: pos[1], z: pos[2], size: game.chunkDistance, ymin: 0, onVoxel: function(x, y, z, type, chunkX, chunkZ) {
      game.setBlock([(chunkX * 16) + x, y, (chunkZ * 16) + z], type)
    }}
    var view = render(region, opts)
  })
})