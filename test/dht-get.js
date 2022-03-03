const DHT = require('bittorrent-dht')
const dht = new DHT()

const hash = 'hash'

dht.listen(20000, function () {
  console.log('now listening')
})

dht.on('peer', function (peer, infoHash, from) {
  console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.address + ':' + from.port)
})


dht.get(hash, function (err, res) {
  console.log("RES", res.v.toString())
})
