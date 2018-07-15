const router = require('express').Router();

router.use('/build', require('./build'));
router.use('/load', require('./load'));
router.use('/registration', require('./registration'));
router.use('/contract', require('./contract'));

module.exports = router;