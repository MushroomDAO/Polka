const DHT = require('bittorrent-dht')
const magnet = require('magnet-uri')

const dht = new DHT()

dht.listen(20000, function () {
  console.log('now listening')
})

dht.on('peer', function (peer, infoHash, from) {
  console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.address + ':' + from.port)
})

const value = 'WTFFFFFF'
const v = Buffer.alloc(100).fill('awesome').toString()

dht.put({ v }, function (err, hash) {
  console.error('error=', err)
  console.log('hash=', hash.toString("hex"))
})

