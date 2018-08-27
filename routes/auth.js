const router = require('express').Router();

/** UTILS **/
const sender = require('../utils/sender');

router.get('/', async(req, res, next) => {
    try {
        if (req.cookies.address) {
            return res.redirect('/');
        } else {
            res.render('pages/auth', {
                page: 'login',
                title: 'Авторизация'
            });
        }
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.post('/', async(req, res, next) => {
    try {
        let address = req.body.address || null;
        let name = req.body.name || null;
        let hash = req.body.hash || null;

        switch (req.body.method) {
            case 'check-developer-registration':
                try {
                    let result = await sender.sendRequestToNode({
                        method: 'post',
                        route: 'get-developer',
                        body: {
                            address: address
                        }
                    });
                    if (result.result) {
                        res.json({
                            registered: true,
                            name: (result.result.name).slice(0, (result.result.name).replace(/\0/g, '').length),
                            info: (result.result.info).slice(0, (result.result.info).replace(/\0/g, '').length),
                            status: 200
                        });
                    } else {
                        res.json({
                            registered: false,
                            status: 200
                        });
                    }
                } catch (e) {
                    res.json({
                        msg: e.message,
                        status: 500
                    });
                }
                break;
            case 'login':
                res.cookie('address', address);
                res.cookie('name', name);
                res.json({
                    status: 200
                });
                break;
            case 'registration':
                let signedTx = req.body.signedTx || null;
                console.log('signedTx:', signedTx);
                if (signedTx) {
                    let result = await sender.sendRequestToNode({
                        method: 'post',
                        route: 'deploy',
                        body: {
                            type: 'registration-developer',
                            signedTransactionData: signedTx
                        }
                    });
                    res.json(result);
                } else {
                    res.json({
                        msg: 'Invalid params',
                        status: 400
                    });
                }
                break;
            case 'logout':
                res.clearCookie("address");
                res.clearCookie("name");
                res.json({
                    status: 200
                });
                break;
            default:
                break;
        }
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

module.exports = router;