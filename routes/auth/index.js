const router = require('express').Router();

router.use('/login', require('./login'));
router.use('/quit', require('./quit'));
router.use('/registration', isAuth, isNotRegistered, require('./registration'));
router.use('/verification', isAuth, isVerified, isNotRegistered, require('./verification'));

function isAuth(req, res, next) {
    let address = req.cookies.address || null;
    let filename = req.cookies.filename || null;

    if (!address || !filename) {
        return res.redirect('/auth/login');
    }
    next();
}
function isVerified(req, res, next) {
    let verified = req.cookies.verified || null;

    if (!verified) {
        return res.redirect('/auth/registration');
    }
    next();
}
function isNotRegistered(req, res, next) {
    let registered = req.cookies.registered === 'true';

    if (registered) {
        return res.redirect('/');
    }
    next();
}

module.exports = router;