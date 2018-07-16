const router = require('express').Router();

/** UTILS **/
const sender = require('../utils/sender');

/** ROUTES **/
router.get('/:id', async(req, res, next) => {
    try {
        let result = await sender.sendRequestToNode({
            method: 'post',
            route: 'get-app',
            body: {
                idApp: req.params.id
            }
        });

        console.log('result:', result);

        res.render('pages/ico', {
            page: 'ico',
            title: 'NAME_APP (ICO)',
            server: lib.nodeAddress,
            app: result.result
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

module.exports = router;
