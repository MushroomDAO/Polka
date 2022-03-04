const IPFS = require('ipfs-core')

const topic = 'testing'
const receiveMsg = (msg) => console.log(new TextDecoder().decode(msg.data))

async function sub() {
  const ipfs = await IPFS.create()
  await ipfs.pubsub.subscribe(topic, receiveMsg)
  console.log(`subscribed to ${topic}`)

  const peerIds = await ipfs.pubsub.peers(topic)
  console.log("PEER IDS", peerIds)
}

sub()