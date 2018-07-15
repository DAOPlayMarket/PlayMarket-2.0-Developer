const router = require('express').Router();
const formidable = require('formidable');
const del = require('del');
const makeDir = require('make-dir');
const path = require('path');
const fse = require('fs-extra');

/** ROUTES **/
router.get('/', async(req, res, next) => {
    try {
        res.render('pages/ico-add/build', {
            page: 'build',
            title: 'ICO',
            idApp: req.query.idApp
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.post('/', async(req, res, next) => {
    try {
        await del(lib.icoDir, {force: true});
        await Promise.all([
            makeDir(lib.icoDir + '/config'),
            makeDir(lib.icoDir + '/images/logo'),
            makeDir(lib.icoDir + '/images/team'),
            makeDir(lib.icoDir + '/images/advisors'),
            makeDir(lib.icoDir + '/images/gallery'),
            makeDir(lib.icoDir + '/images/banner'),
            makeDir(lib.icoDir + '/docs/whitepaper'),
            makeDir(lib.icoDir + '/docs/onepage')
        ]);
        let data = await formidablePromise(req, null);
        res.json({result: data, status: 200});
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        res.json({status: 500, message: e.toString()});
        next(e);
    }
});

function formidablePromise(req, opts) {
    return new Promise((resolve, reject) => {
        let form = new formidable.IncomingForm(opts);

        let config = {
            files: {
                docs: {
                    whitepaper: null,
                    onepage: null
                },
                images: {
                    team: [],
                    advisors: [],
                    gallery: [],
                    logo: null,
                    banner: null
                }
            }
        };

        form.multiples = true;
        form.uploadDir = lib.icoDir;

        form.parse(req);
        form
            .on('error', (err) => {
                if (err) return reject(err)
            })
            .on('field', (field, value) => {
                if (value !== 'undefined') {
                    if (field === 'keywords') {
                        if (value.length !== 0) {
                            config['keywords'] = value.split(" ");
                        } else {
                            config['keywords'] = [];
                        }
                    } else if (field === 'social') {
                        config['social'] = JSON.parse(value);
                    } else {
                        config[field] = value;
                    }
                }
            })
            .on('fileBegin', (field, file) => {
                if (field === 'gallery')
                    file.path = form.uploadDir + '/images/gallery/' + file.name;
                if (field === 'banner')
                    file.path = form.uploadDir + '/images/banner/' + file.name;
                if (field === 'logo')
                    file.path = form.uploadDir + '/images/logo/' + file.name;
                if (field === 'team')
                    file.path = form.uploadDir + '/images/team/' + file.name;
                if (field === 'advisors')
                    file.path = form.uploadDir + '/images/advisors/' + file.name;
                if (field === 'whitepaper')
                    file.path = form.uploadDir + '/docs/whitepaper/' + file.name;
                if (field === 'onepage')
                    file.path = form.uploadDir + '/docs/onepage/' + file.name;
            })
            .on('file', (field, file) => {
                let url = path.relative(lib.icoDir, file.path).replace(/\\/g, "\/");
                if (field === 'logo')
                    config.files.images.logo = url;
                if (field === 'gallery')
                    config.files.images.gallery.push(url);
                if (field === 'banner')
                    config.files.images.banner = url;
                if (field === 'team')
                    config.files.images.team = url;
                if (field === 'advisors')
                    config.files.images.advisors = url;
                if (field === 'whitepaper')
                    config.files.docs.whitepaper = url;
                if (field === 'onepage')
                    config.files.docs.onepage = url;
            })
            .on('end', async() => {
                await fse.outputJson(lib.icoDir + '/config/config.json', config);
                resolve(config);
            })
    })
}

module.exports = router;
