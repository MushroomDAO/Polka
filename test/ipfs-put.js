const IPFS = require('ipfs-core')


async function store() {
  const ipfs = await IPFS.create()
  const { cid } = await ipfs.add('Hello world')
  console.info(cid)
}

store()
