import { IncomingWebhook } from '@slack/webhook'
import Hook from 'console-hook'
import * as Fs from 'node:fs/promises'
import os from 'node:os'
import type { RedisClientType } from 'redis'
import { createClient } from 'redis'
import { SLACK_WEBHOOK_URL } from './settings'
import { XOracleErrorCode } from './errors'
import { XOracleError } from './errors'

export async function loadJson(filepath) {
  const json = await Fs.readFile(filepath, 'utf8')
  return JSON.parse(json)
}

// https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
export const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x)

export function remove0x(s) {
  if (s.substring(0, 2) == '0x') {
    return s.substring(2)
  }
}

export function add0x(s: string) {
  if (s.substring(0, 2) == '0x') {
    return s
  } else {
    return '0x' + s
  }
}

export function pad32Bytes(data) {
  data = remove0x(data)
  let s = String(data)
  while (s.length < 64) {
    s = '0' + s
  }
  return s
}

let slackSentTime = new Date().getTime()
let errMsg = null

async function sendToSlack(error) {
  if (SLACK_WEBHOOK_URL) {
    const e = error[0]
    const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL)
    const text = ` :fire: _An error has occurred at_ \`${os.hostname()}\`\n \`\`\`${JSON.stringify(
      e
    )} \`\`\`\n>*System information*\n>*memory*: ${os.freemem()}/${os.totalmem()}\n>*machine*: ${os.machine()}\n>*platform*: ${os.platform()}\n>*upTime*: ${os.uptime()}\n>*version*: ${os.version()}
   `

    try {
      if (e && e.message && errMsg === e.message) {
        const now = new Date().getTime()
        if (slackSentTime + 60_000 < now) {
          await webhook.send({ text })
          slackSentTime = now
          errMsg = e.message
        }
      } else {
        await webhook.send({ text })
        if (e && e.message) errMsg = e.message
        slackSentTime = new Date().getTime()
      }
    } catch (e) {
      console.log('utils:sendToSlack', e)
    }
  }
}

export function hookConsoleError(logger) {
  const consoleHook = Hook(logger).attach((method, args) => {
    if (method == 'error') {
      sendToSlack(args)
    }
  })
  consoleHook.detach
}

export async function createRedisClient(host: string, port: number): Promise<RedisClientType> {
  const client: RedisClientType = createClient({
    // redis[s]://[[username][:password]@][host][:port][/db-number]
    url: `redis://${host}:${port}`
  })
  await client.connect()
  return client
}

export function buildSubmissionRoundJobId({
  oracleAddress,
  roundId,
  deploymentName
}: {
  oracleAddress: string
  roundId: number
  deploymentName: string
}) {
  return `${roundId}-${oracleAddress}-${deploymentName}`
}

export function buildHeartbeatJobId({
  oracleAddress,
  deploymentName
}: {
  oracleAddress: string
  deploymentName: string
}) {
  return `${oracleAddress}-${deploymentName}`
}

/*
 * Connect `host` and `path` to a single url string, and remove all
 * duplicates of `/` (= slash character) except the first occurrence.
 *
 * @param {string} host, presumably includes scheme string `http(s)://`
 * @param {string} endpoint path
 * @return {string} concatenated string composed of host and endpoint path
 */
export function buildUrl(host: string, path: string) {
  const url = [host, path].join('/')
  return url.replace(/([^:]\/)\/+/g, '$1')
}

export function convertBigIntToString<T>(obj: T): T {
  const str = JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString()
      }
      return value
    })
  )
  return str
}

export const REDUCER_MAPPING = {
  PATH: parseFn,
  PARSE: parseFn,
  MUL: mulFn,
  POW10: pow10Fn,
  ROUND: roundFn,
  INDEX: indexFn,
  DIV: divFn,
  DIVFROM: divFromFn
}

/**
 * Access data in JSON based on given path.
 *
 * Example
 * let obj = {
 *     RAW: { ETH: { USD: { PRICE: 123 } } },
 *     DISPLAY: { ETH: { USD: [Object] } }
 * }
 * const fn = parseFn(['RAW', 'ETH', 'USD', 'PRICE'])
 * fn(obj) // return 123
 */

export function parseFn(args: string | string[]) {
  if (typeof args == 'string') {
    args = args.split(',')
  }

  function wrapper(obj) {
    for (const a of args) {
      if (a in obj) obj = obj[a]
      else throw new XOracleError(XOracleErrorCode.MissingKeyInJson)
    }
    return obj
  }
  return wrapper
}

export function mulFn(args: number) {
  function wrapper(value: number) {
    return value * args
  }
  return wrapper
}

export function divFn(args: number) {
  function wrapper(value: number) {
    return value / args
  }
  return wrapper
}

export function divFromFn(args: number) {
  function wrapper(value: number) {
    if (value == 0) {
      throw new XOracleError(XOracleErrorCode.DivisionByZero)
    }
    return args / value
  }
  return wrapper
}

export function pow10Fn(args: number) {
  function wrapper(value: number) {
    return Number(Math.pow(10, args)) * value
  }
  return wrapper
}

export function roundFn() {
  function wrapper(value: number) {
    return Math.round(value)
  }
  return wrapper
}

export function indexFn(args: number) {
  if (args < 0) {
    throw new XOracleError(XOracleErrorCode.IndexOutOfBoundaries)
  }

  function wrapper(obj) {
    if (args >= obj.length) {
      throw new XOracleError(XOracleErrorCode.IndexOutOfBoundaries)
    } else {
      return obj[args]
    }
  }
  return wrapper
}

export function buildReducer(reducerMapping, reducers) {
  return reducers.map((r) => {
    const reducer = reducerMapping[r.function.toUpperCase()]
    if (!reducer) {
      throw new XOracleError(XOracleErrorCode.InvalidReducer)
    }
    return reducer(r?.args)
  })
}

export function checkDataFormat(data) {
  if (!data) {
    throw new XOracleError(XOracleErrorCode.InvalidData)
  } else if (!Number.isInteger(data)) {
    throw new XOracleError(XOracleErrorCode.InvalidDataFormat)
  }
}
