const router = require('express').Router();

/** MODULES **/
const modules = require('./../modules');

/** ROUTES **/
router.get('/', async(req, res, next) => {
    try {
        res.render('pages/home', {
            page: 'home',
            text: {
                hello: res.__('hello')
            }
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

module.exports = router;
