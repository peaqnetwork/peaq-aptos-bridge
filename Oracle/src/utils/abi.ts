export const abi =[
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
                "internalType": "uint128",
                "name": "amount",
                "type": "uint128"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "recipent",
                "type": "address"
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
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "burned",
                "type": "bool"
            }
        ],
        "name": "eventBurned",
        "type": "event"
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
                "internalType": "address",
                "name": "recipent",
                "type": "address"
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
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "get_chain_id",
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
        "name": "get_fee",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "amount",
                "type": "uint64"
            }
        ],
        "name": "modify_fee",
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
        "name": "set_chain_id",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "transfer_from",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer_to",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "un_pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
