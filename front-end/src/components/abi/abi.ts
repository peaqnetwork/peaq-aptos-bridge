export const abi = [
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "chainId_",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "active_",
				"type": "bool"
			},
			{
				"internalType": "uint64",
				"name": "fee_",
				"type": "uint64"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "recipent",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint128",
				"name": "nonce",
				"type": "uint128"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "chainId",
				"type": "uint8"
			}
		],
		"name": "eventDeposit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint128",
				"name": "amount",
				"type": "uint128"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "recipent",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "timestamp",
				"type": "uint64"
			},
			{
				"indexed": false,
				"internalType": "uint128",
				"name": "nonce",
				"type": "uint128"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "chainId",
				"type": "uint8"
			}
		],
		"name": "eventDeposit",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "active",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "chainId",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getChainId",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "modifyFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "chainId_",
				"type": "uint8"
			}
		],
		"name": "setChainId",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "peaqAddress",
				"type": "bytes32"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferTo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unPause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]