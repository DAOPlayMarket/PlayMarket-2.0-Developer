module.exports = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_app",
                "type": "uint256"
            },
            {
                "name": "_dev",
                "type": "address"
            },
            {
                "name": "_hash",
                "type": "string"
            },
            {
                "name": "_hashType",
                "type": "uint32"
            }
        ],
        "name": "changeHashAppICO",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "CrowdSales",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_app",
                "type": "uint256"
            },
            {
                "name": "_dev",
                "type": "address"
            },
            {
                "name": "_hash",
                "type": "string"
            },
            {
                "name": "_hashType",
                "type": "uint32"
            }
        ],
        "name": "addHashAppICO",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_agent",
                "type": "address"
            },
            {
                "name": "_store",
                "type": "uint32"
            },
            {
                "name": "_state",
                "type": "bool"
            }
        ],
        "name": "updateAgentStorage",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_app",
                "type": "uint256"
            },
            {
                "name": "_dev",
                "type": "address"
            }
        ],
        "name": "DeleteICO",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_PMFund",
                "type": "address"
            }
        ],
        "name": "setPMFund",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_dev",
                "type": "address"
            },
            {
                "name": "_app",
                "type": "uint256"
            },
            {
                "name": "_state",
                "type": "bool"
            }
        ],
        "name": "setConfirmation",
        "outputs": [
            {
                "name": "token",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_multisigWallet",
                "type": "address"
            },
            {
                "name": "_startsAt",
                "type": "uint256"
            },
            {
                "name": "_numberOfPeriods",
                "type": "uint256"
            },
            {
                "name": "_durationOfPeriod",
                "type": "uint256"
            },
            {
                "name": "_targetInUSD",
                "type": "uint256"
            },
            {
                "name": "_CSID",
                "type": "uint256"
            },
            {
                "name": "_app",
                "type": "uint256"
            },
            {
                "name": "_dev",
                "type": "address"
            }
        ],
        "name": "CreateCrowdSale",
        "outputs": [
            {
                "name": "_CrowdSale",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_name",
                "type": "string"
            },
            {
                "name": "_symbol",
                "type": "string"
            },
            {
                "name": "_ATID",
                "type": "uint256"
            },
            {
                "name": "_app",
                "type": "uint256"
            },
            {
                "name": "_dev",
                "type": "address"
            }
        ],
        "name": "CreateAppToken",
        "outputs": [
            {
                "name": "_AppToken",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "Agents",
        "outputs": [
            {
                "name": "state",
                "type": "bool"
            },
            {
                "name": "store",
                "type": "uint32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "acceptOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_contract",
                "type": "address"
            }
        ],
        "name": "setPEXContract",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_CSID",
                "type": "uint256"
            },
            {
                "name": "_contract",
                "type": "address"
            }
        ],
        "name": "setCrowdSaleContract",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "PMFund",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_ATID",
                "type": "uint256"
            },
            {
                "name": "_contract",
                "type": "address"
            }
        ],
        "name": "setAppTokenContract",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "PEXContract",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "AppTokens",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "newOwner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "address"
            },
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "ICOs",
        "outputs": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "symbol",
                "type": "string"
            },
            {
                "name": "startsAt",
                "type": "uint256"
            },
            {
                "name": "number",
                "type": "uint256"
            },
            {
                "name": "duration",
                "type": "uint256"
            },
            {
                "name": "targetInUSD",
                "type": "uint256"
            },
            {
                "name": "token",
                "type": "address"
            },
            {
                "name": "crowdsale",
                "type": "address"
            },
            {
                "name": "hash",
                "type": "string"
            },
            {
                "name": "hashType",
                "type": "uint32"
            },
            {
                "name": "confirmation",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_PMFund",
                "type": "address"
            },
            {
                "name": "_PEXContract",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_contract",
                "type": "address"
            }
        ],
        "name": "setPEXContractEvent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_contract",
                "type": "address"
            }
        ],
        "name": "setAppTokenContractEvent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_contract",
                "type": "address"
            }
        ],
        "name": "setCrowdSaleContractEvent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_to",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    }
];