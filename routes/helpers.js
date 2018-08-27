const router = require('express').Router();
const axios = require('axios');

/** UTILS **/
const sender = require('../utils/sender');

/** ROUTES **/
router.post('/check-tx', async(req, res, next) => {
    let _hash = req.body.hash || null;
    try {
        let result = await sender.sendRequestToNode({
            method: 'post',
            route: 'check-tx',
            body: {
                hash: _hash
            }
        });
        res.json(result);
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        res.json({
            message: e.message,
            status: 500
        });
    }
});

router.post('/get-info-for-tx', async(req, res, next) => {
    let _address = req.body.address || null;
    console.log('_address:', _address);
    try {
        let result = await sender.sendRequestToNode({
            method: 'post',
            route: 'get-info-for-tx',
            body: {
                address: _address
            }
        });
        res.json(result);
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        res.json({
            message: e.message,
            status: 500
        });
    }
});

router.post('/get-subcategories', async(req, res, next) => {
    try {
        let idCTG = req.body.idCTG;

        let category = categories.getCategory(idCTG);

        res.json({
            subcategories: category.subcategories,
            status: 200
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

module.exports = router;