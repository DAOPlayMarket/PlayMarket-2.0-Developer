const router = require('express').Router();

/** UTILS **/
const sender = require('../utils/sender');

/** ROUTES **/
router.get('/:id', async(req, res, next) => {
    try {
        let app = await sender.sendRequestToNode({
            method: 'post',
            route: 'get-app',
            body: {
                idApp: req.params.id
            }
        });

        let ico = await sender.sendRequestToNode({
            method: 'post',
            route: 'get-current-info',
            body: {
                address: app.result.adrICO
            }
        });

        console.log('ico:', ico);

        res.render('pages/ico', {
            page: 'ico',
            title: app.result.nameApp + '(ICO)',
            server: lib.nodeAddress,
            app: app.result,
            ico: ico.result
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

module.exports = router;
