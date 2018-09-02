const router = require('express').Router();
const fse = require('fs-extra');

/** UTILS **/
const tx = require('../../utils/tx');
const sender = require('../../utils/sender');

/** ROUTES **/
router.get('/', async(req, res, next) => {
    try {
        res.render('pages/app-add/registration', {
            page: 'registration',
            title: 'Регистрация приложения',
            hashTag: req.query.hashTag,
            hash: req.query.hash,
            publish: req.query.publish
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.post('/', async(req, res, next) => {
    let filename = req.cookies.filename;
    let password = req.body.password;
    let hash = req.body.hash;
    let hashTag = req.body.hashTag;
    try {
        let config = JSON.parse(fse.readFileSync(lib.appDir + '/config/config.json'));

        let publish = config.publish;
        let price = config.price;

        let signedTx = await tx.getSignedTxForContract({
            filename: filename,
            password: password,
            data: {
                contract: 'main',
                function: 'registrationApplication',
                params: [hash, hashTag, publish, price]
            }
        });
        console.log('signedTx:', signedTx);
        let result = await sender.sendRequestToNode({
            method: 'post',
            route: 'deploy',
            body: {
                type: 'registration-developer',
                signedTransactionData: signedTx
            }
        });
        console.log('result:', result);
        res.json(result);
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        res.json({status: 500, message: e.toString()});
        next(e);
    }
});

module.exports = router;
