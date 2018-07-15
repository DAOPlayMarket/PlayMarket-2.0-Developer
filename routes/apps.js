const router = require('express').Router();
const axios = require('axios');

/** UTILS **/
const sender = require('../utils/sender');

/** ROUTES **/
router.get('/', async(req, res, next) => {
    try {
        let result = await sender.sendRequestToNode({
            method: 'post',
            route: 'get-apps-by-developer',
            body: {
                address: req.cookies.address
            }
        });


        let apps = [];
        for (app of result.result) {
            if (app.loadFile){
                apps.push(app);
            }
        }

        res.render('pages/apps', {
            page: 'apps',
            title: 'Приложения',
            server: lib.nodeAddress,
            apps: apps
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

module.exports = router;
