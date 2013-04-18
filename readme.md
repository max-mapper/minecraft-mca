# minecraft-mca

minecraft .mca region data file pure js parser

extracted from code originally written by @ithkuil for [mcchunkloader](https://github.com/ithkuil/mcchunkloader), turned into a module and now maintained by @maxogden

minecraft is property of Mojang AB

```javascript
// example using voxel.js
var readMCA = require('minecraft-mca')
var mcRegion = require('minecraft-region')
var region = mcRegion(binaryRegionData)
var opts = {ymin: 0, onVoxel: function(x, y, z, type, offsetX, offsetZ) {
  game.setBlock([(offsetX * 16) + x, y, (offsetZ * 16) + z], type)
}}
var mca = readMCA(region, opts)
mca.loadAll() // loads all 1024 chunks in this region
mca.loadNearby(0, 0, 1) // loads 1 in each direction
mca.loadChunk(4, 4) // loads single chunk
```

this module works with [minecraft-chunk](http://github.com/maxogden/minecraft-chunk) and is used by [minecraft-mca](http://github.com/maxogden/minecraft-mca)

designed for use with [browserify](http://browserify.org)

# license

BSD