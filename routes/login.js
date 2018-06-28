const router = require('express').Router();
const axios = require('axios');
const fs = require('fs');
const multer = require('multer');
const web3Utils = require('web3-utils');

/** CONFIG **/
const config = require('./../lib/info');

/** MODULES **/
const modules = require('./../modules');
//
const keystores_dir = './../keystores';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + keystores_dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

/** ROUTES **/
router.get('/', async(req, res, next) => {
    try {
        let accounts = [];
        fs.readdir(__dirname + keystores_dir, async (err, files) => {
            for (let file of files) {
                let keystore = JSON.parse(await readFile(__dirname + keystores_dir + '/' + file));
                accounts.push({'filename': file,'address': '0x' + keystore.address});
            }
            res.render('pages/login', {
                page: 'login',
                accounts: accounts
            });
        });

    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.get('/quit', async(req, res, next) => {
    try {
        res.clearCookie("address");
        res.clearCookie("filename");
        res.clearCookie("registered");
        res.redirect('/login');
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.post('/', async(req, res, next) => {
    let address = req.body.address || null;
    let filename = req.body.filename || null;
    try {
        if(web3Utils.isAddress(address)) {
            let options = {
                method: 'post',
                url:  config.nodeAddress + '/api/get-developer',
                data: {
                    address: address
                }
            };
            let result = (await axios(options)).data;

            if (result.status === 200) {
                res.cookie('address', address);
                res.cookie('filename', filename);
                if (result.result.length !== 0) {
                    res.cookie('registered', true);
                    res.json({
                        registered: true,
                        status: 200
                    });
                } else {
                    res.cookie('registered', false);
                    res.json({
                        registered: false,
                        status: 200
                    });
                }
            } else {
                res.json({
                    status: 400
                });
            }
        } else {
            res.json({status: 406});
        }
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.post('/load', upload.single('keystore'), async(req, res) => {
    try {
        res.json({status: 200});
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
    }
});

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