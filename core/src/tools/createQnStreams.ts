import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createCoordinatorStream } from './quicknode'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function createQnStreams() {
  const filePath = join(__dirname, '..', '..', 'src', 'tools', 'data', 'sei_rr.json')
  const fileData = readFileSync(filePath, 'utf8')
  const streams = JSON.parse(fileData)
  for (const stream of streams) {
    const { chain, coordinatorAddress, eventTopic, startBlock, webhookUrl, name } = stream
    const streamId = await createCoordinatorStream(
      chain,
      coordinatorAddress,
      eventTopic,
      Number(startBlock),
      webhookUrl,
      name
    )
    console.log(streamId)
  }
}
createQnStreams()
