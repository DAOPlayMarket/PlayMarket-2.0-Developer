const router = require('express').Router();
const ua = require('ua-parser-js');

/** ROUTES **/
router.use('*', (req, res, next) => {
    res.locals.agent = ua(req.headers['user-agent']) || null;
    res.locals.language = req.getLocale() || null;
    res.locals.languages = lib.languages;
    res.locals.address = req.cookies.address || null;
    res.locals.filenameKeystore = req.cookies.filename || null;
    res.locals.verified = req.cookies.verified || null;
    res.locals.registered = req.cookies.registered || null;
    res.locals.name = req.cookies.name || null;
    res.locals.categories = lib.categories;
    next();
});

router.use('/auth', require('./auth'));
router.use('/helpers', require('./helpers'));

router.use('/app-add', isAuth, isRegistered, require('./app-add'));
router.use('/ico-add', require('./ico-add'));
// router.use('/ico-add', isAuth, isRegistered, require('./ico-add'));

router.use('/apps', isAuth, isRegistered, require('./apps'));
router.use('/app', isAuth, isRegistered, require('./app'));
router.use('/ico', isAuth, isRegistered, require('./ico'));
router.use('/', isAuth, isRegistered, require('./main'));

router.use((req, res, next) => {
    res.status(404).render('404', {
        title: 'Page not found'
    });
});

router.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    }
    res.sendStatus(403);
});
router.use((err, req, res, next) => {
    console.log('GLOBAL ERROR:', modules.timeNow(), err.toString());
    res.status(500).render('error', {
        msg: 'Looks like something wrong. Please, try again later'
    });
});

function isAuth(req, res, next) {
    let address = req.cookies.address || null;
    let filename = req.cookies.filename || null;

    if (!address || !filename) {
        return res.redirect('/auth/login');
    }
    next();
}
function isRegistered(req, res, next) {
    let registered = req.cookies.registered === 'true';

    if (!registered) {
        return res.redirect('/auth/verification');
    }
    next();
}
// function isVerified(req, res, next) {
//     let verified = req.cookies.verified || null;
//
//     if (!verified) {
//         return res.redirect('/registration');
//     }
//     next();
// }

// function isNotRegistered(req, res, next) {
//     let registered = req.cookies.registered === 'true';
//
//     if (registered) {
//         return res.redirect('/');
//     }
//     next();
// }


module.exports = router;