const router = require('express').Router();
const axios = require('axios');
const fs = require('fs');
const web3Utils = require('web3-utils');
const wallet = require('ethereumjs-wallet');
const tx = require('ethereumjs-tx');
const Web3 = require('web3');

/** CONFIG **/
const config_info = require('./../lib/info');
const config_abi = require('./../lib/abi');

/** MODULES **/
const modules = require('./../modules');

const keystores_dir = './../keystores';

const web3 = new Web3();

/** ROUTES **/
router.get('/', async(req, res, next) => {
    try {
        res.render('pages/registration', {
            page: 'registration',
            account: {
                filename: req.cookies.filename,
                address: req.cookies.address
            }
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.post('/', async(req, res, next) => {
    let password = req.body.password|| null;
    let name = req.body.name || null;
    let info = '';
    let address = req.cookies.address;
    let filename = req.cookies.filename;

    try {
        let keystore = await readFile(__dirname + keystores_dir + '/' + filename);
        try {
            let myWallet = wallet.fromV3(keystore, password, true);
            let privateKey = myWallet.privKey;
            let infoForTx = await getInfoForTx(address);

            let MyContract = web3.eth.contract(config_abi.main);
            let myContractInstance = MyContract.at(config_info.contracts.main);
            let data = myContractInstance.registrationDeveloper.getData(info, name);

            let txParams = {
                nonce: web3Utils.toHex(infoForTx.countTx),
                gasPrice: web3Utils.toHex(infoForTx.gasPrice),
                gasLimit: web3Utils.toHex(250000),
                to: '0x3f2512Aee154F1D7d5EF3670ec0234AEe2FB60A9',
                value: web3Utils.toHex('0'),
                data: data,
                chainId: 4
            };
            console.log('txParams:', txParams);
            let transaction = new tx(txParams);
            transaction.sign(privateKey);
            let serialized = transaction.serialize();

            let options = {
                method: 'post',
                url: config_info.nodeAddress + '/api/deploy',
                data: {
                    type: 'registration-developer',
                    signedTransactionData: serialized.toString('hex')
                }
            };
            let result = (await axios(options)).data;
            if (result.status === 200) {
                res.cookie('registered', true);
            } else {
                res.cookie('registered', false);
            }
            res.json(result);
        } catch(e) {
            console.log('error', modules.timeNow(), e.toString());
            res.json({status: 406});
        }
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

async function getInfoForTx(address) {
    let options = {
        method: 'post',
        url: config_info.nodeAddress + '/api/get-info-for-tx',
        data: {
            address: address
        }
    };
    return (await axios(options)).data.result;
}

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = router;