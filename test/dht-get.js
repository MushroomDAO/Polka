const DHT = require('bittorrent-dht')
const dht = new DHT()

const hash = 'a9fc325dc29461764a490e7fdb127ae82ef4bdb8'

dht.listen(20001, function () {
  console.log('now listening')
})

dht.on('peer', function (peer, infoHash, from) {
  console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.address + ':' + from.port)
})


dht.get(hash, function (err, res) {
  console.log("err", err)
  if (res && res.v) {
    console.log('Value', res.v.toString())
  } else {
    console.log('HUH', res)
  }
})
