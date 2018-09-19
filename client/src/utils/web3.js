import Web3 from 'web3';

import lib from '../lib';

import Notification from '../components/Notification';


let provider = new Web3.providers.WebsocketProvider(lib.web3.infura);
let web3 = new Web3(provider);

provider.on('connect', () => {
    Notification('success', 'Web3 WSS connection successful!');
});
provider.on('error', e => {
    Notification('error', 'Web3 WSS connection error:', e.message);
});
provider.on('close', e => {
    Notification('warn', 'Web3 WSS connection close:', e.message);
});
provider.on('end', e => {
    Notification('warn', 'Web3 WSS connection end:', e.message);
    provider = new Web3.providers.WebsocketProvider(lib.web3.infura);
    web3 = new Web3(provider);
    provider.on('connect', function () {
        Notification('success', 'Web3 WSS reconnection successful!');
    });
});

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

export async function getSignedTransaction(obj) {
    try {
        let Contract = new web3.eth.Contract(lib.contracts[obj.contract].abi, lib.contracts[obj.contract].address);

        let data = await Contract.methods[obj.data.method].apply(this, obj.data.params).encodeABI();
        let gasPrice = await web3.eth.getGasPrice();
        let gasLimit = await web3.eth.estimateGas({
            from: obj.wallet.address,
            to: lib.contracts[obj.contract].address,
            data: data
        });
        let nonce = await web3.eth.getTransactionCount(obj.wallet.address);

        let params = {
            nonce: web3.utils.toHex(nonce),
            gasPrice: web3.utils.toHex(gasPrice),
            gasLimit: web3.utils.toHex(gasLimit + 50000),
            to: lib.contracts[obj.contract].address,
            data: data,
            chainId: 4
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
                    console.log('result:', result);
                    if (!result.pending) {
                        clearTimeout(timer);
                        resolve(result.status);
                    }
                } catch (err) {
                    throw err;
                }
            }, 3000);
        } catch (err) {
            reject(err);
        }
    });
}

export async function contractMethod(obj) {
    console.log('obj:', obj);
    try {
        let Contract = new web3.eth.Contract(lib.contracts[obj.contract].abi, lib.contracts[obj.contract].address);
        return await Contract.methods[obj.name].apply(this, obj.params).call();
    } catch (err) {
        throw err;
    }
}