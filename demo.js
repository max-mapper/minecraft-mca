var render = require('./')
var mcRegion = require('minecraft-region')
var fs = require('fs')
var binaryXHR = require('binary-xhr')
binaryXHR('r.0.0.mca', function(err, data) {
  if (err) return console.error(err)
  var region = mcRegion(data)
  var opts = {x: 172, y: 67, z: 189, size: 3, ymin: 0}
  var view = render(region, opts)
})
