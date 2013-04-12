var render = require('./')
var mcRegion = require('minecraft-region')
var fs = require('fs')
var binaryXHR = require('binary-xhr')
var fly = require('voxel-fly')

var textures = "http://commondatastorage.googleapis.com/voxeltextures/painterly/"

var materials = [["adminium"], "stationary_lava", "stone", "dirt", "redstone_ore", "coal_ore", "gravel", "iron_ore", "double_stone_slab", "grass", "sandstone", "stone_slab", "stone_pressure_plate", "brick", "glass", "iron_door", "wall_sign", "nether_brick_fence", "glowstone", "torch", "wool", "glass_pane", "wood", "wooden_stairs", "bookshelf", "ladder", "nether_brick_stairs", "wooden_plank", "fence", "stone_brick_stairs", "workbench", "wooden_door", "jukebox", "stone_brick", "chest", "iron_block", "furnace", "brick_stairs", "wooden_pressure_plate", "cobblestone", "clay", "fence_gate", "stationary_water", "minecart_track", "powered_rail", "colored_wool", "leaves", "lapis_lazuli_ore", "gold_ore", "obsidian", "brown_mushroom", "redstone_torch_on", "moss_stone", "monster_spawner", "diamond_ore", "signpost", "gold_block"]

var pos = [122, 72, 286]
var regionX = Math.floor((pos[0] >> 4) / 32)
var regionZ = Math.floor((pos[2] >> 4) / 32)
var regionFile = 'r.' + regionX + '.' + regionZ + '.mca'

var game = require('voxel-hello-world')({
  generate: function(x, y, z) { return 0; },
  texturePath: textures,
  playerSkin: textures + '../player.png',
  chunkDistance: 3,
  arrayType: Float32Array,
  worldOrigin: pos,
  materials: materials
})

window.game = game // for console debugging
var makeFly = fly(game)
makeFly(game.controls.target()).startFlying()
window.types = {}

game.controls.target().avatar.position.copy({x: pos[0], y: pos[1], z: pos[2]})
game.once('tick', function() {
  binaryXHR(regionFile, function(err, data) {
    if (err) return console.error(err)
    var region = mcRegion(data)
    window.region = region
    var opts = {x: pos[0], y: pos[1], z: pos[2], size: game.chunkDistance, ymin: 0, onVoxel: function(x, y, z, type, chunkX, chunkZ) {
      if (window.types[type]) window.types[type]++
      else window.types[type] = 1
      game.setBlock([(chunkX * 16) + x, y, (chunkZ * 16) + z], type)
    }}
    var view = render(region, opts)
    window.view = view
  })
})