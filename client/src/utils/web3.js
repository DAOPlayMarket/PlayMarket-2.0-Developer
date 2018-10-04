import Web3 from 'web3';

import lib from '../lib';

import Notification from '../components/Notification';

let web3;
export async function setProvider(provider) {
    try {
        switch (provider) {
            case 'infura':
                stopAddressWatcher_MM();
                provider = new Web3.providers.WebsocketProvider(lib.web3.infura);
                web3 = new Web3(provider);
                Notification('success', 'Web3 (Infura) connection successful!');
                break;
            case 'metamask':
                if (typeof window.web3 !== 'undefined') {
                    provider = window.web3.currentProvider;
                    web3 = new Web3(provider);
                    startAddressWatcher_MM();
                    Notification('success', 'Web3 (MetaMask) connection successful!');
                } else {
                    throw new TypeError('MetaMask extension not installed or disable');
                }
                break;
            default:
                break;
        }
    } catch (err) {
        throw err;
    }
}

/*
-----------------------------------------------------------------------------
 */

let timer = null;
function startAddressWatcher_MM() {
    (async () => {
        let address = await web3.eth.getCoinbase();
        timer = setInterval(async() => {
            if (await web3.eth.getCoinbase() !== address) {
                window.location.reload();
            }
        }, 1000);
    })();
}
function stopAddressWatcher_MM() {
    (async () => {
        clearInterval(timer);
        timer = null;
    })();
}

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
            from: obj.address,
            to: lib.contracts[obj.contract].address,
            data: obj.data,
            chainId: lib.ethereum.chainId
        }
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
export async function getData(obj) {
    try {
        let Contract = new web3.eth.Contract(lib.contracts[obj.contract].abi, lib.contracts[obj.contract].address);
        return await Contract.methods[obj.method].apply(this, obj.params).encodeABI();
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
export async function getGasLimit(obj) {
    try {
        return await web3.eth.estimateGas({
            from: obj.from,
            to: lib.contracts[obj.contract].address,
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
            to: lib.contracts[obj.contract].address,
            data: obj.data,
            chainId: lib.ethereum.chainId
        };
        return await web3.eth.accounts.signTransaction(params, obj.wallet.privateKey);
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
            let timer = await setInterval(async () => {
                try {
                    let tx = await web3.eth.getTransactionReceipt(hash);
                    let result = tx ? {pending: false, status: tx.status} : {pending: true};
                    if (!result.pending) {
                        clearTimeout(timer);
                        resolve(result.status);
                    }
                } catch (err) {
                    throw err;
                }
            }, 1000);
        } catch (err) {
            reject(err);
        }
    });
}
export async function contractMethod(obj) {
    try {
        let Contract = new web3.eth.Contract(lib.contracts[obj.contract].abi, lib.contracts[obj.contract].address);
        return await Contract.methods[obj.name].apply(this, obj.params).call();
    } catch (err) {
        throw err;
    }
}