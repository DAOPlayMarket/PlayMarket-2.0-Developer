const router = require('express').Router();
const path = require('path');
const fse = require('fs-extra');

/** UTILS **/
const ipfs = require('../../utils/ipfs');

/** ROUTES **/
router.post('/', async(req, res, next) => {
    let address = req.cookies.address;
    try {
        let config = JSON.parse(fse.readFileSync(path.join(lib.tmpDirApp, address, 'config', 'config.json')));
        let result = await ipfs.load(path.join(lib.tmpDirApp, address), 'app');
        res.json({
            result: {
                hashTag: result.hashTag,
                hash: result.hash,
                publish: config.publish,
            },
            status: 200
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        res.json({status: 500, message: e.toString()});
        next(e);
    }
});

module.exports = router;
