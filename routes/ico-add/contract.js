const router = require('express').Router();

/** UTILS **/
const tx = require('../../utils/tx');
const sender = require('../../utils/sender');

/** ROUTES **/
router.get('/', async(req, res, next) => {
    try {
        res.render('pages/ico-add/contract', {
            page: 'contract',
            title: 'ICO',
            idApp: req.query.idApp
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.post('/', async(req, res, next) => {
    console.log(req.body);
    try {
        let filename = req.cookies.filename;
        let password = req.body.password;

        let icoName = req.body.icoName;
        let icoSymbol = req.body.icoSymbol;
        let icoStartDate = req.body.icoStartDate;
        let address = req.body.address;
        let icoHardCapUsd = req.body.icoHardCapUsd;
        let idApp = req.body.idApp;

        let signedTx = await tx.getSignedTxForContract({
            filename: filename,
            password: password,
            data: {
                contract: 'main',
                function: 'getTokensContract',
                params: [icoName, icoSymbol, address, icoStartDate, icoHardCapUsd, idApp]
            }
        });
        console.log('signedTx:', signedTx);
        let result = await sender.sendRequestToNode({
            method: 'post',
            route: 'deploy',
            body: {
                type: 'get-tokens-contract',
                signedTransactionData: signedTx
            }
        });
        console.log('result:', result);
        res.json(result);
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

module.exports = router;
