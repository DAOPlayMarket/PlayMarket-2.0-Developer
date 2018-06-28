const router = require('express').Router();
const axios = require('axios');

/** MODULES **/
const modules = require('./../modules');

/** CONFIG **/
const config_info = require('./../lib/info');
const config_abi = require('./../lib/abi');

/** ROUTES **/
router.get('/', async(req, res, next) => {
    try {
        let options = {
            method: 'post',
            url: config_info.nodeAddress + '/api/get-apps-by-developer',
            data: {
                address: req.cookies.address
            }
        };
        let result = (await axios(options)).data;
        res.render('pages/apps', {
            page: 'apps',
            server: config_info.nodeAddress,
            apps: result.result
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

module.exports = router;
