import * as dotenv from 'dotenv'
import { JsonRpcProvider } from 'ethers'
dotenv.config()

export const CHAIN = process.env.CHAIN || 'localhost'
export const DEPLOYMENT_NAME = process.env.DEPLOYMENT_NAME || 'xOracle'

export const DATA_FEED_FULFILL_GAS_MINIMUM = 400_000
export const VRF_FULLFILL_GAS_PER_WORD = 1_000
export const RR_FULLFILL_GAS_MINIMUM = 500_000

export const WORKER_PORT = process.env.WORKER_PORT || 3011
export const LISTENER_PORT = process.env.LISTENER_PORT || 3012

export const LISTENER_DELAY = Number(process.env.LISTENER_DELAY) || 1500

export const LISTENER_DATA_FEED_LATEST_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-data-feed-latest-queue`
export const LISTENER_DATA_FEED_PROCESS_EVENT_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-data-feed-process-event-queue`
export const WORKER_DATA_FEED_QUEUE_NAME = `${DEPLOYMENT_NAME}-worker-data-feed-queue`
export const DATA_FEED_SERVICE_NAME = 'DATA_FEED'
export const REPORTER_AGGREGATOR_QUEUE_NAME = `${DEPLOYMENT_NAME}-reporter-aggregator-queue`

export const DATA_FEED_LISTENER_STATE_NAME = `${DEPLOYMENT_NAME}-listener-data-feed-state`
export const DATA_FEED_WORKER_STATE_NAME = `${DEPLOYMENT_NAME}-worker-data-feed-state`

export const HEARTBEAT_JOB_NAME = `${DEPLOYMENT_NAME}-heartbeat-job`
export const HEARTBEAT_QUEUE_NAME = `${DEPLOYMENT_NAME}-heartbeat-queue`
export const SUBMIT_HEARTBEAT_QUEUE_NAME = `${DEPLOYMENT_NAME}-submitheartbeat-queue`

export const WORKER_AGGREGATOR_QUEUE_NAME = `${DEPLOYMENT_NAME}-worker-aggregator-queue`
export const WORKER_CHECK_HEARTBEAT_QUEUE_NAME = `${DEPLOYMENT_NAME}-worker-checkheartbeat-queue`

export const WORKER_DEVIATION_QUEUE_NAME = `${DEPLOYMENT_NAME}-deviation-queue`

// VRF
export const LISTENER_VRF_HISTORY_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-vrf-history-queue`
export const LISTENER_VRF_LATEST_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-vrf-latest-queue`
export const LISTENER_VRF_PROCESS_EVENT_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-vrf-process-event-queue`
export const VRF_LISTENER_STATE_NAME = `${DEPLOYMENT_NAME}-vrf-listener-state`
export const VRF_SERVICE_NAME = 'VRF'
export const WORKER_VRF_QUEUE_NAME = `${DEPLOYMENT_NAME}-worker-vrf-queue`

export const REMOVE_ON_COMPLETE = 500
export const REMOVE_ON_FAIL = 1_000
export const CONCURRENCY = 12
// Data Feed
export const MAX_DATA_STALENESS = 600_000

// Request Response
export const LISTENER_RR_HISTORY_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-rr-history-queue`
export const LISTENER_RR_PROCESS_EVENT_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-rr-process-event-queue`
export const LISTENER_RR_LATEST_QUEUE_NAME = `${DEPLOYMENT_NAME}-listener-rr-latest-queue`
export const RR_LISTENER_STATE_NAME = `${DEPLOYMENT_NAME}-rr-listener-state`
export const RR_SERVICE_NAME = 'RR'
export const WORKER_RR_QUEUE_NAME = `${DEPLOYMENT_NAME}-worker-rr-queue`

export const LOG_LEVEL = process.env.LOG_LEVEL || 'info'
export const LOG_DIR = process.env.LOG_DIR || './log'

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
export const REDIS_PORT = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379

export const REDIS_USERNAME = process.env.REDIS_USERNAME || ''
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''

export const PROVIDER_URL = process.env.PROVIDER_URL || 'http://127.0.0.1:8545'
export const API_URL = process.env.API_URL || 'http://localhost:3000'
export const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || ''
export const INTFERENCE_API_URL = process.env.INTFERENCE_API_URL || 'http://localhost:3013'

export const LISTENER_VRF_PORT = process.env.LISTENER_VRF_PORT || '3001'
export const LISTENER_RR_PORT = process.env.LISTENER_RR_PORT || '3002'
export const LISTENER_ADCS_PORT = process.env.LISTENER_ADCS_PORT || '3003'

export const QUICKNODE_API_KEY = process.env.QUICKNODE_API_KEY || ''
export const WEBHOOK_KEY = process.env.WEBHOOK_KEY || ''
export const ADCS_API_URL = process.env.ADCS_API_URL || 'http://localhost:3004'

export const BULLMQ_CONNECTION = {
  concurrency: CONCURRENCY,
  connection: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    username: 'default',
    password: REDIS_PASSWORD
  }
}

export const LISTENER_JOB_SETTINGS = {
  removeOnComplete: REMOVE_ON_COMPLETE,
  removeOnFail: REMOVE_ON_FAIL,
  attempts: 10,
  backoff: 1_000
}

export const WORKER_JOB_SETTINGS = {
  removeOnComplete: REMOVE_ON_COMPLETE,
  removeOnFail: REMOVE_ON_FAIL,
  attempts: 10,
  backoff: 1_000
}

export const AGGREGATOR_QUEUE_SETTINGS = {
  // When [aggregator] worker fails, we want to be able to
  // resubmit the job with the same job ID.
  removeOnFail: true,
  attempts: 10,
  backoff: 1_000
}

export const SUBMIT_HEARTBEAT_QUEUE_SETTINGS = {
  removeOnComplete: REMOVE_ON_COMPLETE,
  removeOnFail: REMOVE_ON_FAIL,
  attempts: 10,
  backoff: 1_000
}

export const CHECK_HEARTBEAT_QUEUE_SETTINGS = {
  removeOnComplete: REMOVE_ON_COMPLETE,
  removeOnFail: REMOVE_ON_FAIL,
  attempts: 10,
  backoff: 1_000,
  repeat: {
    every: 30 * 60 * 1000 //30'
  }
}

export const HEARTBEAT_QUEUE_SETTINGS = {
  removeOnComplete: true,
  attempts: 10,
  backoff: 1_000
}

export const ALL_QUEUES = [
  `${DEPLOYMENT_NAME}-worker-data-feed-queue`,
  `${DEPLOYMENT_NAME}-worker-adcs-queue`,
  `${DEPLOYMENT_NAME}-worker-automate-adcs-queue`,
  `${DEPLOYMENT_NAME}-worker-deviation-queue`,
  `${DEPLOYMENT_NAME}-worker-aggregator-queue`,
  `${DEPLOYMENT_NAME}-worker-checkheartbeat-queue`,
  `${DEPLOYMENT_NAME}-heartbeat-queue`,
  `${DEPLOYMENT_NAME}-submitheartbeat-queue`,
  `${DEPLOYMENT_NAME}-listener-data-feed-latest-queue`,
  `${DEPLOYMENT_NAME}-listener-data-feed-process-event-queue`,
  `${DEPLOYMENT_NAME}-listener-adcs-history-queue`,
  `${DEPLOYMENT_NAME}-listener-adcs-latest-queue`,
  `${DEPLOYMENT_NAME}-listener-adcs-process-event-queue`
]

function createJsonRpcProvider(providerUrl: string = PROVIDER_URL) {
  return new JsonRpcProvider(providerUrl)
}
export const PROVIDER = createJsonRpcProvider()

export function getObservedBlockRedisKey(contractAddress: string) {
  return `${contractAddress}-listener-${DEPLOYMENT_NAME}`
}
