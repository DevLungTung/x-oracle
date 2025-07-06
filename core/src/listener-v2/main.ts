import { parseArgs } from 'node:util'
import { buildLogger } from '../logger'
import { XOracleError, XOracleErrorCode } from '../errors'
import { hookConsoleError } from '../utils'
import { IListenersV2 } from './types'
import { buildListener as buildVRFListener } from './vrf'
import { buildListener as buildRRListener } from './request-response'

const LISTENERS: IListenersV2 = {
  VRF: buildVRFListener,
  RR: buildRRListener
}

const FILE_NAME = import.meta.url
const LOGGER = buildLogger('listener')

async function main() {
  hookConsoleError(LOGGER)
  const service = loadArgs()

  if (!LISTENERS[service]) {
    LOGGER.error({ name: 'listener:main', file: FILE_NAME, service }, 'service')
    throw new XOracleError(XOracleErrorCode.UndefinedListenerRequested)
  }
  LISTENERS[service](LOGGER)
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
