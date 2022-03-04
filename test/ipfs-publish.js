const IPFS = require('ipfs-core')

const topic = 'testing'
const msg = new TextEncoder().encode('banana')

const receiveMsg = (msg) => console.log(new TextDecoder().decode(msg.data))

async function pub() {
  const ipfs = await IPFS.create()
  // await ipfs.pubsub.subscribe(topic, receiveMsg)
  await ipfs.pubsub.publish(topic, msg)
  console.log("publish")
}

pub()



