import { Interface } from 'ethers'
import { Logger } from 'pino'
import type { RedisClientType } from 'redis'
import { listenerService } from './listener'
import { IListenerConfig, IRandomWordsRequested, IVrfListenerWorker } from '../types'
import { ProcessEventOutputType } from './types'
import {
  CHAIN,
  LISTENER_VRF_HISTORY_QUEUE_NAME,
  LISTENER_VRF_LATEST_QUEUE_NAME,
  LISTENER_VRF_PROCESS_EVENT_QUEUE_NAME,
  VRF_LISTENER_STATE_NAME,
  VRF_SERVICE_NAME,
  WORKER_VRF_QUEUE_NAME
} from '../settings'
import { VRF_COORDINATOR_ABI } from '../constants/vrf.coordinator.abi'
import { getVrfConfig } from '../apis'

const FILE_NAME = import.meta.url

export async function buildListener(
  config: IListenerConfig[],
  redisClient: RedisClientType,
  rpcUrl: string,
  logger: Logger
) {
  const stateName = VRF_LISTENER_STATE_NAME
  const service = VRF_SERVICE_NAME
  const chain = CHAIN
  const eventName = 'DataRequested'
  const latestQueueName = LISTENER_VRF_LATEST_QUEUE_NAME
  const historyQueueName = LISTENER_VRF_HISTORY_QUEUE_NAME
  const processEventQueueName = LISTENER_VRF_PROCESS_EVENT_QUEUE_NAME
  const workerQueueName = WORKER_VRF_QUEUE_NAME
  const iface = new Interface(VRF_COORDINATOR_ABI)

  listenerService({
    config,
    abi: VRF_COORDINATOR_ABI,
    stateName,
    service,
    chain,
    rpcUrl,
    eventName,
    latestQueueName,
    historyQueueName,
    processEventQueueName,
    workerQueueName,
    processFn: await processEvent({ iface, logger }),
    redisClient,
    listenerInitType: 'latest',
    logger
  })
}

async function processEvent({ iface, logger }: { iface: Interface; logger: Logger }) {
  const _logger = logger.child({ name: 'VRF processEvent', file: FILE_NAME })
  const { keyHash } = await getVrfConfig({ chain: CHAIN })

  async function wrapper(log): Promise<ProcessEventOutputType | undefined> {
    const eventData = iface.parseLog(log)?.args as unknown as IRandomWordsRequested
    _logger.debug(eventData, 'eventData')

    if (eventData.keyHash != keyHash) {
      _logger.info(`Ignore event with keyhash [${eventData.keyHash}]`)
    } else {
      const jobName = 'vrf'
      const requestId = eventData.requestId.toString()
      const jobData: IVrfListenerWorker = {
        callbackAddress: log.address,
        blockNum: log.blockNumber,
        blockHash: log.blockHash,
        requestId,
        seed: eventData.preSeed.toString(),
        accId: Number(eventData.accId),
        callbackGasLimit: Number(eventData.callbackGasLimit),
        numWords: Number(eventData.numWords),
        sender: eventData.sender,
        isDirectPayment: eventData.isDirectPayment
      }
      console.log('jobData', { jobData })
      _logger.debug(jobData, 'jobData')

      return { jobName, jobId: requestId, jobData }
    }
  }

  return wrapper
}
