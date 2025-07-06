import { Interface } from 'ethers'
import { Logger } from 'pino'
import type { RedisClientType } from 'redis'
import { listenerService } from './listener'
import { IDataRequested, IListenerConfig, IRequestResponseListenerWorker } from '../types'
import { ProcessEventOutputType } from './types'
import {
  CHAIN,
  LISTENER_RR_HISTORY_QUEUE_NAME,
  LISTENER_RR_LATEST_QUEUE_NAME,
  LISTENER_RR_PROCESS_EVENT_QUEUE_NAME,
  RR_LISTENER_STATE_NAME,
  RR_SERVICE_NAME,
  WORKER_RR_QUEUE_NAME
} from '../settings'
import { RequestResponseAbi } from '../constants/rr.coordinator.abi'
const FILE_NAME = import.meta.url

export async function buildListener(
  config: IListenerConfig[],
  redisClient: RedisClientType,
  rpcUrl: string,
  logger: Logger
) {
  const stateName = RR_LISTENER_STATE_NAME
  const service = RR_SERVICE_NAME
  const chain = CHAIN
  const eventName = 'DataRequested'
  const latestQueueName = LISTENER_RR_LATEST_QUEUE_NAME
  const historyQueueName = LISTENER_RR_HISTORY_QUEUE_NAME
  const processEventQueueName = LISTENER_RR_PROCESS_EVENT_QUEUE_NAME
  const workerQueueName = WORKER_RR_QUEUE_NAME
  const iface = new Interface(RequestResponseAbi)

  listenerService({
    config,
    abi: RequestResponseAbi,
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
  const _logger = logger.child({ name: 'Request-Response processEvent', file: FILE_NAME })

  async function wrapper(log): Promise<ProcessEventOutputType | undefined> {
    const eventData = iface.parseLog(log)?.args as unknown as IDataRequested
    _logger.debug(eventData, 'eventData')

    const requestId = eventData.requestId.toString()
    const jobData: IRequestResponseListenerWorker = {
      callbackAddress: log.address,
      blockNum: log.blockNumber,
      requestId,
      jobId: eventData.jobId.toString(),
      accId: eventData.accId.toString(),
      callbackGasLimit: Number(eventData.callbackGasLimit),
      sender: eventData.sender,
      isDirectPayment: eventData.isDirectPayment,
      numSubmission: Number(eventData.numSubmission),
      data: eventData.data.toString()
    }
    _logger.debug(jobData, 'jobData')
    return { jobName: 'request-response', jobId: requestId, jobData }
  }

  return wrapper
}
