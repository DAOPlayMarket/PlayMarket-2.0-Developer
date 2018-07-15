const router = require('express').Router();
const axios = require('axios');

/** UTILS **/
const sender = require('../../utils/sender');

/** ROUTES **/
router.get('/', async(req, res, next) => {
    try {
        res.render('pages/auth/verification', {
            page: 'verification',
            title: 'Подтверждение регистрации'
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.get('/check', async(req, res, next) => {
    let address = req.cookies.address;
    let hash = req.cookies.verified;
    try {
        let checkTx = await sender.sendRequestToNode({
            method: 'post',
            route: 'check-tx',
            body: {
                hash: hash
            }
        });
        if (checkTx.status === 200) {
            if (checkTx.result.panding) {
                res.json({
                    result: {
                        panding: true
                    },
                    status: 200
                });
            } else {
                if (checkTx.result.success) {
                    let result = await sender.sendRequestToNode({
                        method: 'post',
                        route: 'get-developer',
                        body: {
                            type: 'registration-developer',
                            address: address
                        }
                    });
                    if (result.status === 200) {
                        if (result.result) {
                            res.cookie('registered', true);
                            res.cookie('name', result.result.name);
                            res.json({
                                result: {
                                    registered: true,
                                    panding: false
                                },
                                status: 200
                            });
                        } else {
                            res.json({
                                result: {
                                    registered: false,
                                    panding: false
                                },
                                status: 200
                            });
                        }
                    }
                } else {
                    res.clearCookie("verified");
                    res.json({
                        result: {
                            message: 'Ошибка при отправке транзакции',
                            panding: false
                        },
                        status: 406
                    });
                }
            }
        } else if (checkTx.status === 400) {
            res.json({
                result: {
                    message: 'Некорректные параметры'
                },
                status: checkTx.status
            });
        } else if (checkTx.status === 500) {
            res.json({
                result: {
                    message: 'Ошибка на сервере, повторите попытку позже'
                },
                status: checkTx.status
            });
        } else {
            res.json(checkTx);
        }
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        res.json({
            result: 'Ошибка на сервере',
            status: 500
        });
        next(e);
    }
});

module.exports = router;