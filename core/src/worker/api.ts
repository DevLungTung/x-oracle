import axios from 'axios'
import { URL } from 'node:url'
import { Logger } from 'pino'
import { API_URL } from '../settings'
import {
  IAdapter,
  IAggregate,
  IAggregateById,
  IAggregator,
  IErrorMsgData,
  IMemeData
} from '../types'
import { buildUrl } from '../utils'
import { XOracleError, XOracleErrorCode } from '../errors'
import { IFetchAiModelData } from './types'

export const AGGREGATE_ENDPOINT = buildUrl(API_URL, 'aggregate')
export const AGGREGATOR_ENDPOINT = buildUrl(API_URL, 'aggregator')
export const ERROR_ENDPOINT = buildUrl(API_URL, 'error')
export const PRICE_ENDPOINT = buildUrl(API_URL, 'price')
export const OUTPUT_TYPE_ENDPOINT = buildUrl(API_URL, 'adaptors/by-job-id')
export const MEME_ENDPOINT = buildUrl(API_URL, 'inference')
export const ADD_0G_KEY_ENDPOINT = buildUrl(API_URL, 'zero')

/**
/**
 * Fetch aggregate data from `Network API` data feed endpoint
 * given aggregator ID.
 *
 * @param {string} aggregator hash
 * @param {Logger} logger
 * @return {IAggregate} metadata about the latest aggregate
 * @exception {FailedToGetAggregate}
 */
export async function fetchDataFeed({
  aggregatorHash,
  logger
}: {
  aggregatorHash: string
  logger: Logger
}): Promise<IAggregate> {
  try {
    const url = buildUrl(AGGREGATE_ENDPOINT, `${aggregatorHash}/latest`)
    return (await axios.get(url))?.data
  } catch (e) {
    logger.error(e)
    throw new XOracleError(XOracleErrorCode.FailedToGetAggregate)
  }
}

export async function fetchDataFeedByAggregatorId({
  aggregatorId,
  logger
}: {
  aggregatorId: bigint
  logger: Logger
}): Promise<IAggregateById> {
  try {
    const url = buildUrl(AGGREGATE_ENDPOINT, `id/${aggregatorId}/latest`)
    return (await axios.get(url))?.data
  } catch (e) {
    logger.error(e)
    throw new XOracleError(XOracleErrorCode.FailedToGetAggregate)
  }
}

/**
 * Get single `Aggregator` given aggregator address.
 *
 * @param {string} oracle address
 * @param {Logger} logger
 * @return {Aggregator}
 * @exception {FailedToGetAggregator}
 */
export async function getAggregatorGivenAddress({
  oracleAddress,
  logger
}: {
  oracleAddress: string
  logger: Logger
}): Promise<IAggregator> {
  const url = new URL(AGGREGATOR_ENDPOINT)
  url.searchParams.append('address', oracleAddress)

  let response = []
  try {
    response = (await axios.get(url.toString()))?.data
  } catch (e) {
    logger.error(e)
    throw new XOracleError(XOracleErrorCode.FailedToGetAggregator)
  }

  if (response.length == 1) {
    logger.debug(response)
    return response[0]
  } else if (response.length == 0) {
    const msg = 'No aggregator found'
    logger.error(msg)
    throw new XOracleError(XOracleErrorCode.FailedToGetAggregator, msg)
  } else {
    const msg = `Expected one aggregator, received ${response.length}`
    logger.error(msg)
    throw new XOracleError(XOracleErrorCode.FailedToGetAggregator, msg)
  }
}

/**
 * Get all `Aggregator`s on given `chain`. The data are fetched from
 * the `API`.
 *
 * @param {string} chain name
 * @param {string} activeness of aggregator
 * @param {Logger} logger
 * @return {Aggregator[]}
 * @exception {FailedToGetAggregator}
 */
export async function getAggregators({
  chain,
  active,
  logger
}: {
  chain: string
  active?: boolean
  logger: Logger
}): Promise<IAggregator[]> {
  try {
    const url = new URL(AGGREGATOR_ENDPOINT)
    url.searchParams.append('chain', chain)
    if (active) {
      url.searchParams.append('active', 'true')
    }
    const response = (await axios.get(url.toString()))?.data
    return response
  } catch (e) {
    logger.error(e)
    throw new XOracleError(XOracleErrorCode.FailedToGetAggregator)
  }
}

/**
 * Get `Aggregator` from `API` given an aggregator hash and chain.
 *
 * @param {string} aggregator hash
 * @param {string} chain name
 * @param {Logger} logger
 * @return {Aggregator}
 * @exception {FailedToGetAggregator}
 */
export async function getAggregator({
  aggregatorHash,
  chain,
  logger
}: {
  aggregatorHash: string
  chain: string
  logger: Logger
}): Promise<IAggregator> {
  try {
    const url = buildUrl(AGGREGATOR_ENDPOINT, `hash/${aggregatorHash}/${chain}`)
    const response = (await axios.get(url))?.data
    return response
  } catch (e) {
    logger.error(e)
    throw new XOracleError(XOracleErrorCode.FailedToGetAggregator)
  }
}

/**
 * Store catched RR worker error log to
 * `API` `error` endpoint
 *
 * @param {data} IErrorMsgData
 * @param {Logger} logger
 * @exception {FailedToGetAggregate}
 */
export async function storeErrorMsg({ data, logger }: { data: IErrorMsgData; logger: Logger }) {
  try {
    const response = (await axios.post(ERROR_ENDPOINT, data))?.data
    return response
  } catch (e) {
    logger.error(e)
    throw new XOracleError(XOracleErrorCode.FailedToStoreErrorMsg)
  }
}

export async function fetchDataFeedByPairName({
  pairName,
  logger
}: {
  pairName: string
  logger: Logger
}): Promise<IAggregate> {
  try {
    const url = buildUrl(AGGREGATE_ENDPOINT, `name/${pairName}/latest`)
    return (await axios.get(url))?.data
  } catch (e) {
    logger.error(e)
    throw new XOracleError(XOracleErrorCode.FailedToGetAggregate)
  }
}

export async function fetchPriceByPairName({
  pairName,
  logger
}: {
  pairName: string
  logger: Logger
}): Promise<IAggregate> {
  try {
    const url = buildUrl(PRICE_ENDPOINT, `coinPrice/${pairName}`)
    return (await axios.get(url))?.data
  } catch (e) {
    logger.error(e)
    throw new XOracleError(XOracleErrorCode.FailedToGetAggregate)
  }
}

export async function fetchAdapterByJobId(jobId: string, logger: Logger): Promise<IAdapter> {
  try {
    const url = buildUrl(OUTPUT_TYPE_ENDPOINT, `?jobId=${jobId}`)
    const item = (await axios.get(url))?.data

    return {
      id: item.id,
      jobId: item.jobId,
      name: item.name,
      description: item.description,
      categoryId: item.categoryId,
      aiPrompt: item.aiPrompt,
      provider: item.provider,
      outputTypeId: item.outputType.id,
      outputTypeName: item.outputType.name,
      coordinatorAddress: item.outputType.coordinatorAddress,
      fulfillDataRequestFn: item.outputType.fulfillDataRequestFn
    }
  } catch (e) {
    logger.error(e)
    throw new XOracleError(XOracleErrorCode.FailedToGetAdaptor)
  }
}

export async function fetchMemeCoinData({ logger }: { logger: Logger }): Promise<IMemeData> {
  try {
    const url = buildUrl(MEME_ENDPOINT, 'meme')
    return (await axios.get(url))?.data
  } catch (e) {
    logger.error(e)
    throw new XOracleError(XOracleErrorCode.FailedToGetAggregate)
  }
}

export async function fetchAiModelData({
  logger,
  url,
  data
}: {
  logger: Logger
  url: string
  data: IFetchAiModelData
}) {
  try {
    return (await axios.post(url, data))?.data.result
  } catch (e) {
    logger.error(e)
    throw new XOracleError(XOracleErrorCode.FailedToGetAggregate)
  }
}

export async function add0GKey(txHash: string, rootHash: string) {
  try {
    const url = `${ADD_0G_KEY_ENDPOINT}/${txHash}/${rootHash}`
    await axios.post(url)
  } catch (error) {
    console.log(error)
  }
}

export async function executeAdapterById(code: string, input: { [key: string]: any }) {
  try {
    const url = buildUrl(OUTPUT_TYPE_ENDPOINT, `/${code}`)
    const adapter = (await axios.get(url))?.data
    if (!adapter) {
      throw new XOracleError(XOracleErrorCode.FailedToGetAdaptor, 'No adapter found')
    }
    const inputObject = adapter.inputEntity
    const compare = Object.keys(inputObject).every((key) => input[key] !== undefined)
    if (!compare) {
      throw new XOracleError(XOracleErrorCode.FailedToGetAdaptor, 'Input is not valid')
    }
    const response = await axios.post(buildUrl(API_URL, `v1/adapter/run/${code}`), {
      input: input
    })
    return {
      response: response.data,
      fulfillDataRequestFn: adapter.fulfillDataRequestFn,
      outputType: adapter.outputType,
      outputEntity: adapter.outputEntity
    }
  } catch (e) {
    console.error(e)
    throw new XOracleError(XOracleErrorCode.FailedToGetAdaptor, 'Failed to execute adapter')
  }
}

export async function addFulfillmentTx({
  txHash,
  requestId,
  consumerAddress,
  service,
  amount,
  balance,
  status
}: {
  txHash: string
  requestId: string
  consumerAddress: string
  service: string
  amount: string
  balance: string
  status: string
}) {
  try {
    const url = buildUrl(API_URL, 'consumer/fulfillment')
    const data = {
      txHash,
      service,
      amount,
      requestId,
      balance,
      status,
      consumerAddress
    }
    await axios.post(url, data)
  } catch (e) {
    console.error(e)
  }
}
