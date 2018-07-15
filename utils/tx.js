const Web3 = require('web3');
const wallet = require('ethereumjs-wallet');
const tx = require('ethereumjs-tx');
const axios = require('axios');
const fse = require('fs-extra');

const web3 = new Web3();

const getSignedTxForContract = (data) => {
    return new Promise(async(resolve, reject) => {
        console.log('data:', data);
        try {
            let filename = data.filename;
            let password = data.password;

            let keystore = (fse.readFileSync(lib.keystoreDir + '/' + filename)).toString('utf8');
            let myWallet = wallet.fromV3(keystore, password, true);
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
                // gasLimit: web3.toHex(250000),
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
            console.log('error', modules.timeNow(), e.toString());
        }
    });
};

async function getInfoForTx(address) {
    let options = {
        method: 'post',
        url: lib.nodeAddress + '/api/get-info-for-tx',
        data: {
            address: address
        }
    };
    return (await axios(options)).data.result;
}

module.exports= {
    getSignedTxForContract: getSignedTxForContract
};