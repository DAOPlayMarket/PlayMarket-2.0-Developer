import Web3 from 'web3';

import lib from '../lib';

import Notification from '../components/Notification';

let web3;
export async function setProvider(_provider) {
    try {
        switch (_provider) {
            case 'infura': {
                stopAddressWatcher_MM();
                let provider = new Web3.providers.WebsocketProvider(lib.web3.infura);
                web3 = new Web3(provider);
                provider.on('connect', () => {
                    startWebSocketPing();
                    Notification('success', 'Web3 (Infura) connection successful!');
                });
                break;
            }
            case 'metamask': {
                stopWebSocketPing();
                if (window.ethereum) {
                    window.ethereum.setMaxListeners(30);
                    web3 = new Web3(window.ethereum);
                    const netId = await web3.eth.net.getId();
                    if (parseInt(netId) === lib.ethereum.chainId) {
                        try {
                            await window.ethereum.enable();
                            startAddressWatcher_MM();
                            Notification('success', 'Web3 (MetaMask) connection successful!');
                        } catch (err) {
                            console.error(err);
                            Notification('error', 'Web3 (MetaMask) connection failed! User denied account access.');
                        }
                    } else {
                        throw new TypeError('You have the incorrect network id. Please, change it to ' + lib.ethereum.chainId + ' ('+ lib.ethereum.chainName +')');
                    }
                } else if (window.web3) {
                    window.web3.setMaxListeners(30);
                    web3 = new Web3(window.web3.currentProvider);
                    startAddressWatcher_MM();
                    Notification('success', 'Web3 (MetaMask) connection successful!');
                } else {
                    throw new TypeError('MetaMask extension not installed or disable');
                }
                break;
            }
            default:
                break;
        }
    } catch (err) {
        throw err;
    }
}

let timer1 = null;
function startWebSocketPing() {
    (async () => {
        timer1 = setInterval(async() => {
            await web3.eth.getBlockNumber();
        }, 60000);
    })();
}
function stopWebSocketPing() {
    (async () => {
        clearInterval(timer1);
        timer1 = null;
    })();
}

let timer2 = null;
function startAddressWatcher_MM() {
    (async () => {
        let address = await web3.eth.getCoinbase();
        timer2 = setInterval(async() => {
            if (await web3.eth.getCoinbase() !== address) {
                window.location.reload();
            }
        }, 2000);
    })();
}
function stopAddressWatcher_MM() {
    (async () => {
        clearInterval(timer2);
        timer2 = null;
    })();
}

/*
-----------------------------------------------------------------------------
 */

export async function getAddress_MM() {
    try {
        return await web3.eth.getCoinbase();
    } catch (err) {
        throw err;
    }
}
export async function sendTransaction_MM(params) {
    try {
        return await web3.eth.sendTransaction(params);
    } catch (err) {
        throw err;
    }
}

/*
-----------------------------------------------------------------------------
 */

export async function getTxParams(obj) {
    try {
        return {
            gasPrice: web3.utils.toHex(obj.gasPrice),
            gasLimit: web3.utils.toHex(obj.gasLimit),
            from: obj.from,
            to: obj.contract.address,
            data: obj.data,
            chainId: lib.ethereum.chainId
        }
    } catch (err) {
        throw err;
    }
}
export async function getDataByTypes(obj) {
   try {
        return await web3.eth.abi.encodeFunctionCall(
            {
                name: obj.name,
                type: obj.type,
                inputs: obj.inputs
            }, obj.params);
    } catch (err) {
        throw err;
    }
}

/*
-----------------------------------------------------------------------------
 */

export async function getContractsInfo(contracts) {
    try {
        const Contract = new web3.eth.Contract(contracts.Proxy.abi, contracts.Proxy.address);
        let result = await Contract.methods.getLastVersion().call();
        result.ICOList = await contractMethod({
            contract: {
                address: result.ICO,
                abi: contracts.ICO.abi
            },
            name: 'ICOList',
            params: []
        });
        return result;
    } catch (err) {
        throw err;
    }
}

/*
-----------------------------------------------------------------------------
 */

export async function getWallet(keystore, password) {
    try {
        return await web3.eth.accounts.decrypt(keystore, password, true);
    } catch (err) {
        throw err;
    }
}
export async function getBalance(address) {
    try {
        return await web3.eth.getBalance(address);
    } catch (err) {
        throw err;
    }
}
export async function getGasPrice() {
    try {
        return await web3.eth.getGasPrice();
    } catch (err) {
        throw err;
    }
}
export async function sendSignedTransaction(rawTransaction) {
    try {
        return await web3.eth.sendSignedTransaction(rawTransaction);
    } catch (err) {
        throw err;
    }
}
export async function getTransactionStatus(hash) {
    return new Promise(async (resolve, reject) => {
        try {
            let timerTx = await setInterval(async () => {
                try {
                    let tx = await web3.eth.getTransactionReceipt(hash);
                    let result = tx ? {pending: false, status: tx.status} : {pending: true};
                    if (!result.pending) {
                        clearInterval(timerTx);
                        resolve(result.status);
                    }
                } catch (err) {
                    throw err;
                }
            }, 2000);
        } catch (err) {
            reject(err);
        }
    });
}
export async function getData(obj) {
    try {
        let Contract = new web3.eth.Contract(obj.contract.abi, obj.contract.address);
        return await Contract.methods[obj.method].apply(this, obj.params).encodeABI();
    } catch (err) {
        throw err;
    }
}
export async function getGasLimit(obj) {
    try {
        return await web3.eth.estimateGas({
            from: obj.from,
            to: obj.contract.address,
            data: obj.data
        }) + obj.reserve;
    } catch (err) {
        throw err;
    }
}
export async function getSignedTransaction(obj) {
    try {
        let params = {
            gasPrice: web3.utils.toHex(obj.gasPrice),
            gasLimit: web3.utils.toHex(obj.gasLimit),
            to: obj.contract.address,
            data: obj.data,
            chainId: lib.ethereum.chainId
        };
        return await web3.eth.accounts.signTransaction(params, obj.wallet.privateKey);
    } catch (err) {
        throw err;
    }
}
export async function contractMethod(obj) {
    try {
        const Contract = new web3.eth.Contract(obj.contract.abi, obj.contract.address);
        return await Contract.methods[obj.name].apply(this, obj.params).call();
    } catch (err) {
        throw err;
    }
}