const router = require('express').Router();
const ua = require('ua-parser-js');

router.use('*', (req, res, next) => {
    console.log(' *** USER AGENT *** ');
    console.log('IP:', req.ip);
    console.log('OS:', ua(req.headers['user-agent']).os.name + ' ' + ua(req.headers['user-agent']).os.version);
    console.log('Browser:', ua(req.headers['user-agent']).browser.name + ', v ' + ua(req.headers['user-agent']).browser.version);
    console.log('Engine:', ua(req.headers['user-agent']).engine.name + ', v ' + ua(req.headers['user-agent']).engine.version);
    console.log(' ****** ');
    next();
});

router.use('/get-nodes', require('./get-nodes'));

router.use('/app-add', require('./app-add'));
router.use('/update-apk', require('./update-apk'));
router.use('/ico-add', require('./ico-add'));

module.exports = router;