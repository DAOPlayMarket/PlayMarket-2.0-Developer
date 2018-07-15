const router = require('express').Router();

router.use('/build', require('./build'));
router.use('/load', require('./load'));
router.use('/registration', require('./registration'));

module.exports = router;