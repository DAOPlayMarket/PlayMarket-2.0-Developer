const router = require('express').Router();
const ua = require('ua-parser-js');

router.use('*', (req, res, next) => {
    console.log(' *** USER AGENT *** ');
    console.log(ua(req.headers['user-agent']));
    console.log(' ****** ');
    next();
});

router.use('/get-nodes', require('./get-nodes'));

router.use('/app-add', require('./app-add'));
router.use('/update-apk', require('./update-apk'));
router.use('/ico-add', require('./ico-add'));

module.exports = router;