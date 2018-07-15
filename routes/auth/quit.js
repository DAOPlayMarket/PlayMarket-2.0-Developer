const router = require('express').Router();

router.get('/', async(req, res, next) => {
    try {
        res.redirect('/auth/login');
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

module.exports = router;

