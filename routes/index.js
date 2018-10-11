const router = require('express').Router();

router.use('/app-add', require('./app-add'));
router.use('/update-apk', require('./update-apk'));
router.use('/ico-add', require('./ico-add'));

module.exports = router;