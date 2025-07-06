import { Interface, Log } from 'ethers'
import { Logger } from 'pino'
import { listenerServiceV2 } from './listener'
import { IDataRequested, IRequestResponseListenerWorker } from '../types'
import { IProcessEventListenerJobV2, ProcessEventOutputType } from './types'
import {
  LISTENER_RR_PROCESS_EVENT_QUEUE_NAME,
  WORKER_RR_QUEUE_NAME,
  BULLMQ_CONNECTION,
  LISTENER_JOB_SETTINGS,
  LISTENER_RR_PORT,
  WEBHOOK_KEY
} from '../settings'
import { RequestResponseAbi } from '../constants/rr.coordinator.abi'
import { Queue } from 'bullmq'
import { getUniqueEventIdentifier } from './utils'
import express, { Request, Response } from 'express'

const FILE_NAME = import.meta.url

export async function buildListener(logger: Logger) {
  const processEventQueueName = LISTENER_RR_PROCESS_EVENT_QUEUE_NAME
  const workerQueueName = WORKER_RR_QUEUE_NAME
  const iface = new Interface(RequestResponseAbi)
  const app = express()

  listenerServiceV2({
    processEventQueueName,
    workerQueueName,
    processFn: await processEvent({ iface, logger }),
    logger
  })

  app.post('/events/rr', async (req: Request, res: Response) => {
    logger.debug('/events/rr')
    try {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        const key = req.headers['x-oracle-key']
        if (key !== WEBHOOK_KEY) {
          res.status(401).send('Unauthorized')
          return
        }
        const data = JSON.parse(body)
        if (data && data.events && data.events.length > 0) {
          requestResponseStreamListener({ chain: data.chain, events: data.events, iface })
        }
        res.status(200).send('Webhook received')
      })
    } catch (e) {
      logger.error(e)
      res.status(500).send(e)
    }
  })

  app.listen(LISTENER_RR_PORT, () => {
    logger.info(`Listener v2 listening on port ${LISTENER_RR_PORT}`)
  })

  // Handle graceful shutdown
  async function handleExit() {
    logger.info('Exiting. Wait for graceful shutdown.')

    // Close the express server
    await new Promise<void>((resolve) => {
      app.listen().close(() => {
        logger.info('Express server closed')
        resolve()
      })
    })

    process.exit(0)
  }

  // Listen for termination signals
  process.on('SIGINT', handleExit)
  process.on('SIGTERM', handleExit)
}

async function processEvent({ iface, logger }: { iface: Interface; logger: Logger }) {
  const _logger = logger.child({ name: 'Request-Response processEvent', file: FILE_NAME })

  async function wrapper(log: Log): Promise<ProcessEventOutputType | undefined> {
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

export async function requestResponseStreamListener({
  chain,
  events,
  iface
}: {
  chain: string
  events: Log[]
  iface: Interface
}) {
  const processEventQueue = new Queue(LISTENER_RR_PROCESS_EVENT_QUEUE_NAME, BULLMQ_CONNECTION)
  for (const [index, event] of events.entries()) {
    const eventData = iface?.parseLog(event)
    if (!eventData) {
      continue
    }
    if (eventData.name !== 'DataRequested') {
      continue
    }
    const outData: IProcessEventListenerJobV2 = {
      chain,
      contractAddress: event.address,
      event
    }
    const jobId = getUniqueEventIdentifier(event, index)
    await processEventQueue.add('latest', outData, {
      jobId,
      ...LISTENER_JOB_SETTINGS
    })
    console.log(`Added job ${jobId} to queue ${LISTENER_RR_PROCESS_EVENT_QUEUE_NAME}`)
  }
}
