const router = require('express').Router();
const del = require('del');
const path = require('path');
const makeDir = require('make-dir');
const fse = require('fs-extra');
const formidable = require('formidable');
const ApkReader = require('adbkit-apkreader');

/** UTILS **/
const ipfs = require(path.join(__dirname, '..', 'utils', 'ipfs.js'));

router.get('/', async (req, res) => {
    console.log(`/download [${req.method}] ${modules.time.timeNow()}`);
    try {
        const multihash = (typeof req.query.multihash !== 'undefined') ? req.query.multihash : null;
        const address = (typeof req.query.address !== 'undefined') ? req.query.address.toLowerCase() : null;

        if (multihash && address) {
            const dir = path.join(lib.dirApp, address);

            await del(dir);
            await makeDir(dir);

            await ipfs.download(dir, multihash);

            const config = JSON.parse(fse.readFileSync(path.join(dir, 'config', 'config.json')));

            res.json({
                result: config,
                status: 200
            });
        } else {
            res.json({
                result: 'Invalid params',
                status: 200
            });
        }
    } catch(err) {
        console.error(`error ${modules.time.timeNow()}`, err);
        res.json({result: err.toString(), status: 500});
    }
});

module.exports = router;