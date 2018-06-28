const router = require('express').Router();
const axios = require('axios');

/** MODULES **/
const modules = require('./../modules');


/** ROUTES **/
router.post('/check-tx', async(req, res, next) => {
    try {
        res.json({status: 200});
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

module.exports = router;