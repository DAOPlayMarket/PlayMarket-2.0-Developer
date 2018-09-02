const lib = require('../lib');

const wallet = require('ethereumjs-wallet');
const tx = require('ethereumjs-tx');

const web3 = new Web3();

const getWallet = (keystore, password, mixedCaps) => {
    return new Promise(async(resolve, reject) => {
        try {
            let myWallet = wallet.fromV3(keystore, password, mixedCaps);
            resolve(myWallet);
        } catch(e) {
            reject(e);
        }
    });
};

const getSignedTxForContract = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let myWallet = data.wallet;

            let address = myWallet.getAddress();
            let privateKey = myWallet.privKey;

            let infoForTx = await getInfoForTx('0x' + address.toString('hex'));

            let MyContract = web3.eth.contract(lib.contracts[data.data.contract].abi);
            let myContractInstance = MyContract.at(lib.contracts[data.data.contract].address);

            let txData = myContractInstance[data.data.function].getData.apply(this, data.data.params);

            let txParams = {
                nonce: web3.toHex(infoForTx.countTx),
                gasPrice: web3.toHex(infoForTx.gasPrice),
                gasLimit: web3.toHex(2000000),
                to: lib.contracts[data.data.contract].address,
                data: txData,
                chainId: 4
            };
            let transaction = new tx(txParams);
            transaction.sign(privateKey);
            let serialized = transaction.serialize();
            resolve(serialized.toString('hex'));
        } catch (e) {
            reject(e);
        }
    });
};

async function getInfoForTx(address) {
    let options = {
        method: 'post',
        url: '/helpers/get-info-for-tx',
        data: {
            address: address
        }
    };
    return (await axios(options)).data.result;
}

module.exports = {
    getWallet: getWallet,
    getSignedTxForContract: getSignedTxForContract
};



