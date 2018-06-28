const router = require('express').Router();
const ua = require('ua-parser-js');

/** MODULES **/
const modules = require('./../modules');

/** LIBRARY **/
const info = require('./../lib/info');

/** ROUTES **/
router.use('*', (req, res, next) => {
    res.locals.agent = ua(req.headers['user-agent']) || null;
    res.locals.language = req.getLocale() || null;
    res.locals.languages = info.languages;
    res.locals.address = req.cookies.address || null;
    res.locals.filenameKeystore = req.cookies.filename || null;
    res.locals.registered = req.cookies.registered || null;
    next();
});

router.use('/login', require('./login'));
router.use('/helpers', require('./helpers'));
router.use('/registration', isAuth, require('./registration'));
router.use('/app', isAuthAndRegistered, require('./app'));
router.use('/ico', isAuthAndRegistered, require('./ico'));
router.use('/apps', isAuthAndRegistered, require('./apps'));
router.use('/', isAuthAndRegistered, require('./main'));

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
        return res.redirect('/login');
    }
    next();
}

function isAuthAndRegistered(req, res, next) {
    let address = req.cookies.address || null;
    let filename = req.cookies.filename || null;
    let registered = req.cookies.registered || null;

    if (!address || !filename || !registered || registered === 'false') {
        return res.redirect('/login');
    }
    next();
}

module.exports = router;