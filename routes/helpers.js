const router = require('express').Router();
const axios = require('axios');

/** ROUTES **/
router.post('/check-tx', async(req, res, next) => {
    let _hash = req.body.hash || null;
    try {
        let options = {
            method: 'post',
            url:  lib.nodeAddress + '/api/check-tx',
            data: {
                hash: _hash
            }
        };
        let result = (await axios(options)).data;
        res.json(result);
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
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