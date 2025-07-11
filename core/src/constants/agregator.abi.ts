export const AggregatorAbi = [
  {
    inputs: [
      {
        internalType: 'uint32',
        name: '_timeout',
        type: 'uint32'
      },
      {
        internalType: 'address',
        name: '_validator',
        type: 'address'
      },
      {
        internalType: 'uint8',
        name: '_decimals',
        type: 'uint8'
      },
      {
        internalType: 'string',
        name: '_description',
        type: 'string'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'MaxSubmissionGtOracleNum',
    type: 'error'
  },
  {
    inputs: [],
    name: 'MinSubmissionGtMaxSubmission',
    type: 'error'
  },
  {
    inputs: [],
    name: 'MinSubmissionZero',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NewRequestTooSoon',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NoDataPresent',
    type: 'error'
  },
  {
    inputs: [],
    name: 'OffChainReadingOnly',
    type: 'error'
  },
  {
    inputs: [],
    name: 'OracleAlreadyEnabled',
    type: 'error'
  },
  {
    inputs: [],
    name: 'OracleNotEnabled',
    type: 'error'
  },
  {
    inputs: [],
    name: 'PrevRoundNotSupersedable',
    type: 'error'
  },
  {
    inputs: [],
    name: 'RequesterNotAuthorized',
    type: 'error'
  },
  {
    inputs: [],
    name: 'RestartDelayExceedOracleNum',
    type: 'error'
  },
  {
    inputs: [],
    name: 'RoundNotAcceptingSubmission',
    type: 'error'
  },
  {
    inputs: [],
    name: 'TooManyOracles',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'int256',
        name: 'current',
        type: 'int256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'roundId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'updatedAt',
        type: 'uint256'
      }
    ],
    name: 'AnswerUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'roundId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'startedBy',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startedAt',
        type: 'uint256'
      }
    ],
    name: 'NewRound',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'whitelisted',
        type: 'bool'
      }
    ],
    name: 'OraclePermissionsUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'requester',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'authorized',
        type: 'bool'
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'delay',
        type: 'uint32'
      }
    ],
    name: 'RequesterPermissionsSet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint32',
        name: 'minSubmissionCount',
        type: 'uint32'
      },
      {
        indexed: true,
        internalType: 'uint32',
        name: 'maxSubmissionCount',
        type: 'uint32'
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'restartDelay',
        type: 'uint32'
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'timeout',
        type: 'uint32'
      }
    ],
    name: 'RoundDetailsUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'int256',
        name: 'submission',
        type: 'int256'
      },
      {
        indexed: true,
        internalType: 'uint32',
        name: 'round',
        type: 'uint32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      }
    ],
    name: 'SubmissionReceived',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previous',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'current',
        type: 'address'
      }
    ],
    name: 'ValidatorUpdated',
    type: 'event'
  },
  {
    inputs: [],
    name: 'MAX_ORACLE_COUNT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_removed',
        type: 'address[]'
      },
      {
        internalType: 'address[]',
        name: '_added',
        type: 'address[]'
      },
      {
        internalType: 'uint32',
        name: '_minSubmissionCount',
        type: 'uint32'
      },
      {
        internalType: 'uint32',
        name: '_maxSubmissionCount',
        type: 'uint32'
      },
      {
        internalType: 'uint32',
        name: '_restartDelay',
        type: 'uint32'
      }
    ],
    name: 'changeOracles',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'currentRoundStartedAt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'description',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getOracles',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint80',
        name: '_roundId',
        type: 'uint80'
      }
    ],
    name: 'getRoundData',
    outputs: [
      {
        internalType: 'uint80',
        name: 'roundId',
        type: 'uint80'
      },
      {
        internalType: 'int256',
        name: 'answer',
        type: 'int256'
      },
      {
        internalType: 'uint256',
        name: 'startedAt',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'updatedAt',
        type: 'uint256'
      },
      {
        internalType: 'uint80',
        name: 'answeredInRound',
        type: 'uint80'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      {
        internalType: 'uint80',
        name: 'roundId',
        type: 'uint80'
      },
      {
        internalType: 'int256',
        name: 'answer',
        type: 'int256'
      },
      {
        internalType: 'uint256',
        name: 'startedAt',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'updatedAt',
        type: 'uint256'
      },
      {
        internalType: 'uint80',
        name: 'answeredInRound',
        type: 'uint80'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'maxSubmissionCount',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'minSubmissionCount',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'oracleCount',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_oracle',
        type: 'address'
      },
      {
        internalType: 'uint32',
        name: '_queriedRoundId',
        type: 'uint32'
      }
    ],
    name: 'oracleRoundState',
    outputs: [
      {
        internalType: 'bool',
        name: '_eligibleToSubmit',
        type: 'bool'
      },
      {
        internalType: 'uint32',
        name: '_roundId',
        type: 'uint32'
      },
      {
        internalType: 'int256',
        name: '_latestSubmission',
        type: 'int256'
      },
      {
        internalType: 'uint64',
        name: '_startedAt',
        type: 'uint64'
      },
      {
        internalType: 'uint64',
        name: '_timeout',
        type: 'uint64'
      },
      {
        internalType: 'uint8',
        name: '_oracleCount',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'requestNewRound',
    outputs: [
      {
        internalType: 'uint80',
        name: '',
        type: 'uint80'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'restartDelay',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_requester',
        type: 'address'
      },
      {
        internalType: 'bool',
        name: '_authorized',
        type: 'bool'
      },
      {
        internalType: 'uint32',
        name: '_delay',
        type: 'uint32'
      }
    ],
    name: 'setRequesterPermissions',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newValidator',
        type: 'address'
      }
    ],
    name: 'setValidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_roundId',
        type: 'uint256'
      },
      {
        internalType: 'int256',
        name: '_submission',
        type: 'int256'
      }
    ],
    name: 'submit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'timeout',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'typeAndVersion',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: '_minSubmissionCount',
        type: 'uint32'
      },
      {
        internalType: 'uint32',
        name: '_maxSubmissionCount',
        type: 'uint32'
      },
      {
        internalType: 'uint32',
        name: '_restartDelay',
        type: 'uint32'
      },
      {
        internalType: 'uint32',
        name: '_timeout',
        type: 'uint32'
      }
    ],
    name: 'updateFutureRounds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'validator',
    outputs: [
      {
        internalType: 'contract IAggregatorValidator',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
