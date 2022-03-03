const DHT = require('bittorrent-dht')
const magnet = require('magnet-uri')

const uri = 'magnet:?xt=urn:btih:e3811b9539cacff680e418124272177c47477157'
const parsed = magnet(uri)

console.log(parsed.infoHash) // 'e3811b9539cacff680e418124272177c47477157'

const dht = new DHT()

dht.listen(20000, function () {
  console.log('now listening')
})

dht.on('peer', function (peer, infoHash, from) {
  console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.address + ':' + from.port)
})

// find peers for the given torrent info hash
// dht.lookup(parsed.infoHash)



const value = Buffer.alloc(200).fill('test message')

dht.put({ v: value }, function (err, hash) {
  console.error('error=', err)
  console.log('hash=', hash)

  dht.get(hash, function (err, res) {
    console.log("RES", res.v.toString())
  })
})

