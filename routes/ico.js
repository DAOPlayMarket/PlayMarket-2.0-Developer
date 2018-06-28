const router = require('express').Router();
const axios = require('axios');

/** CONFIG **/
const config = require('./../lib/info');

/** MODULES **/
const modules = require('./../modules');

/** ROUTES **/
router.get('/:id', async(req, res, next) => {
    try {
        res.render('pages/ico', {
            page: 'ico',
            descr: '# This is description for ICO'
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

module.exports = router;
