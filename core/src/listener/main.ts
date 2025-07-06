import { parseArgs } from 'node:util'
import type { RedisClientType } from 'redis'
import { buildLogger } from '../logger'
import { buildListener as buildRRListener } from './request-response'
import { buildListener as buildVRFListener } from './vrf'
import { postprocessListeners } from './utils'
import { XOracleError, XOracleErrorCode } from '../errors'
import { CHAIN, REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } from '../settings'
import { getListeners } from './api'
import { hookConsoleError } from '../utils'
import { IListeners } from './types'
import { createClient } from 'redis'

const LISTENERS: IListeners = {
  RR: buildRRListener,
  VRF: buildVRFListener
}

const FILE_NAME = import.meta.url
const LOGGER = buildLogger('listener')

async function main() {
  hookConsoleError(LOGGER)
  const service = loadArgs()

  const listenersRawConfig = await getListeners({ service, chain: CHAIN })
  const listenersConfig = postprocessListeners({
    listenersRawConfig,
    service,
    chain: CHAIN,
    logger: LOGGER
  })
  console.log('config', service, listenersConfig[service], LISTENERS[service])

  if (!LISTENERS[service] || !listenersConfig[service]) {
    LOGGER.error({ name: 'listener:main', file: FILE_NAME, service }, 'service')
    throw new XOracleError(XOracleErrorCode.UndefinedListenerRequested)
  }

  const redisClient: RedisClientType = createClient({
    url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
  })

  await redisClient.connect()

  LISTENERS[service](
    listenersConfig[service],
    redisClient,
    listenersConfig[service][0].rpcUrl,
    LOGGER
  )
  LOGGER.info('Listener launched')
}

function loadArgs(): string {
  const {
    values: { service }
  } = parseArgs({
    options: {
      service: {
        type: 'string'
      }
    }
  })

  if (!service) {
    throw Error('Missing --service argument.')
  }

  if (!Object.keys(LISTENERS).includes(service)) {
    throw Error(`${service} is not supported service.`)
  }

  return service
}

main().catch((e) => {
  LOGGER.error(e)
  process.exitCode = 1
})
