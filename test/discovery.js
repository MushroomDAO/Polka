var swarm = require('discovery-swarm')

var sw = swarm()

sw.listen(1000)
sw.join('test') // can be any id/name/hash

sw.on('connection', function (connection) {
  console.log('found + connected to peer')
})