const router = require('express').Router();

/** UTILS **/
const ipfs = require('../../utils/ipfs');

/** ROUTES **/
router.post('/', async(req, res, next) => {
    try {
        let result = await ipfs.load(lib.appDir, 'app');
        console.log('result:', result);
        res.json({result: result, status: 200});
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        res.json({status: 500, message: e.toString()});
        next(e);
    }
});

module.exports = router;
