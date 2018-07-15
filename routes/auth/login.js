const router = require('express').Router();
const axios = require('axios');
const path = require('path');
const fse = require('fs-extra');
const formidable = require('formidable');
const readdir = require("recursive-readdir");

/** UTILS **/
const sender = require('../../utils/sender');

/** ROUTES **/
router.get('/', async(req, res, next) => {
    res.clearCookie("address");
    res.clearCookie("filename");
    res.clearCookie("verified");
    res.clearCookie("registered");
    res.clearCookie("name");
    try {
        let accounts = [];
        let files = await readdir(lib.keystoreDir);
        for (let file of files) {
            let keystore = JSON.parse(fse.readFileSync(file));
            accounts.push(
                {
                    'filename': path.relative(lib.keystoreDir, file),
                    'address': '0x' + keystore.address
                }
            );
        }
        res.render('pages/auth/login', {
            page: 'login',
            title: 'Авторизация',
            accounts: accounts
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.post('/', async(req, res, next) => {
    let address = req.body.address || null;
    let filename = req.body.filename || null;
    try {
        let result = await sender.sendRequestToNode({
            method: 'post',
            route: 'get-developer',
            body: {
                address: address
            }
        });
        if (result.status === 200) {
            res.cookie('address', address);
            res.cookie('filename', filename);
            if (result.result) {
                res.cookie('registered', true);
                res.cookie('name', result.result.name);
                res.json({
                    registered: true,
                    status: 200
                });
            } else {
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
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.post('/load', async(req, res) => {
    try {
        await formidablePromise(req, null);
        res.json({status: 200});
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
    }
});

function formidablePromise(req, opts) {
    return new Promise((resolve, reject) => {
        let form = new formidable.IncomingForm(opts);

        form.uploadDir = lib.keystoreDir;

        form.parse(req);
        form
            .on('error', (err) => {
                if (err) return reject(err)
            })
            .on('fileBegin', (name, file) => {
                if (name === 'keystore')
                    file.path = form.uploadDir + '/' + file.name;
            })
            .on('end', async() => {
                resolve();
            })
    })
}

module.exports = router;