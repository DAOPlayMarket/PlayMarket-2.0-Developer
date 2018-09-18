module.exports = [{
        "constant": true,
        "inputs": [],
        "name": "adrAgent",
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
                "type": "address"
            }
        ],
        "name": "developers",
        "outputs": [
            {
                "name": "confirmation",
                "type": "bool"
            },
            {
                "name": "name",
                "type": "bytes32"
            },
            {
                "name": "info",
                "type": "bytes32"
            },
            {
                "name": "isSet",
                "type": "bool"
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
                "name": "_adrDev",
                "type": "address"
            }
        ],
        "name": "checkConfirmation",
        "outputs": [
            {
                "name": "success",
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
                "name": "_adrDev",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "bool"
            }
        ],
        "name": "confirmationDeveloper",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_adrDev",
                "type": "address"
            },
            {
                "name": "_name",
                "type": "bytes32"
            },
            {
                "name": "_info",
                "type": "bytes32"
            }
        ],
        "name": "changeDeveloperInfo",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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
                "name": "_adrDev",
                "type": "address"
            },
            {
                "name": "_name",
                "type": "bytes32"
            },
            {
                "name": "_info",
                "type": "bytes32"
            }
        ],
        "name": "registrationDeveloper",
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
                "name": "_autoConfirm",
                "type": "bool"
            }
        ],
        "name": "changeAoutoConfirm",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_adrAgent",
                "type": "address"
            }
        ],
        "name": "setAgent",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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
]