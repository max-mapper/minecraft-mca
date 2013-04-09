# minecraft-mca

minecraft .mca region data file pure js parser

extracted from code originally written by @ithkuil for [mcchunkloader](https://github.com/ithkuil/mcchunkloader), turned into a module and now maintained by @maxogden

minecraft is property of Mojang AB

```javascript
// example using voxel.js
var readMCA = require('minecraft-mca')
var mcRegion = require('minecraft-region')
var region = mcRegion(binaryRegionData)
var opts = {x: worldOrigin[0], y: worldOrigin[1], z: worldOrigin[2], size: game.chunkDistance, ymin: 0, onVoxel: function(x, y, z, type, offsetX, offsetZ) {
  game.setBlock([(offsetX * 16) + x, y, (offsetZ * 16) + z], type)
}}
var view = render(region, opts)
```

this module works with [minecraft-chunk](http://github.com/maxogden/minecraft-chunk) and is used by [minecraft-mca](http://github.com/maxogden/minecraft-mca)

designed for use with [browserify](http://browserify.org)

# license

BSD