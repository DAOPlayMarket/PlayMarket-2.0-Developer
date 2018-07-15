const router = require('express').Router();
const axios = require('axios');

/** UTILS **/
const tx = require('../../utils/tx');
const sender = require('../../utils/sender');

/** ROUTES **/
router.get('/', async(req, res, next) => {
    try {
        res.render('pages/auth/registration', {
            page: 'registration',
            title: 'Регистрация',
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

router.post('/', async(req, res) => {
    let password = req.body.password || null;
    let name = req.body.name || null;
    let info = '';
    let filename = req.cookies.filename;

    try {
        let signedTx = await tx.getSignedTxForContract({
            filename: filename,
            password: password,
            data: {
                contract: 'main',
                function: 'registrationDeveloper',
                params: [name, info]
            }
        });
        let result = await sender.sendRequestToNode({
            method: 'post',
            route: 'deploy',
            body: {
                type: 'registration-developer',
                signedTransactionData: signedTx
            }
        });
        if (result.status === 200) {
            res.cookie('verified', result.result.hash);
        }
        res.json(result);
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        res.json({status: 500, message: e.message});
    }
});

module.exports = router;