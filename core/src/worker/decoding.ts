import cbor from 'cbor'
import { XOracleError, XOracleErrorCode } from '../errors'
import { IRequestOperation } from '../types'
import { remove0x } from '../utils'

// export async function decodeRequest(anyRequest: string): Promise<IRequestOperation[]> {
//   anyRequest = remove0x(anyRequest)
//   const buffer = Buffer.from(anyRequest, 'hex')
//   const decodedMessage = await cbor.decodeAll(buffer)
//   const request: IRequestOperation[] = []

//   // decodedMessage.length is expected to be even, pairs of Key and Value
//   if (decodedMessage.length % 2 == 1) {
//     throw new XOracleError(
//       XOracleErrorCode.InvalidDecodedMesssageLength,
//       decodedMessage.length.toString()
//     )
//   }

//   for (let i = 0; i < decodedMessage.length; i += 2) {
//     request.push({ name: decodedMessage[i], value: decodedMessage[i + 1] })
//   }

//   return request
// }

export async function decodeRequest(anyApiRequest: string): Promise<IRequestOperation[]> {
  anyApiRequest = remove0x(anyApiRequest)
  const buffer = Buffer.from(anyApiRequest, 'hex')
  const decodedMessage = await cbor.decodeAll(buffer)
  const request: IRequestOperation[] = []

  // decodedMessage.length is expected to be even, pairs of Key and Value
  if (decodedMessage.length % 2 == 1) {
    throw new XOracleError(
      XOracleErrorCode.InvalidDecodedMesssageLength,
      decodedMessage.length.toString()
    )
  }

  for (let i = 0; i < decodedMessage.length; i += 2) {
    request.push({ function: decodedMessage[i], args: decodedMessage[i + 1] })
  }

  return request
}
