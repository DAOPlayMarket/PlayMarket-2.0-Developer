const router = require('express').Router();
const axios = require('axios');
const path = require('path');
const fse = require('fs-extra');

/** ROUTES **/
router.get('/:id', async(req, res, next) => {
    try {
        // let descr = await readFile(lib.appDir + '/description/description');
        res.render('pages/ico', {
            page: 'ico',
            title: 'NAME_APP (ICO)',
            // descr: descr
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

function readFile(path) {
    return new Promise((resolve, reject) => {
        fse.readFile(path, 'utf8', (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = router;
