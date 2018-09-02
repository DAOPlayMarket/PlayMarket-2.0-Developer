const router = require('express').Router();
const formidable = require('formidable');
const del = require('del');
const makeDir = require('make-dir');
const path = require('path');
const fse = require('fs-extra');

/** ROUTES **/
router.get('/', async(req, res, next) => {
    try {
        res.render('pages/app-add/build', {
            page: 'build',
            title: 'Добавление приложения',
            categories: categories.getCategories()
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.post('/', async(req, res, next) => {
    let address = req.cookies.address;
    try {
        await del(path.join(lib.tmpDirApp, address), {force: true});
        await Promise.all([
            makeDir(path.join(lib.tmpDirApp, address, 'apk')),
            makeDir(path.join(lib.tmpDirApp, address, 'config')),
            makeDir(path.join(lib.tmpDirApp, address, 'images', 'logo')),
            makeDir(path.join(lib.tmpDirApp, address, 'images', 'gallery')),
            makeDir(path.join(lib.tmpDirApp, address, 'images', 'banner'))
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
                apk: null,
                images: {
                    banner: null,
                    gallery: [],
                    logo: null
                }
            }
        };

        form.multiples = true;
        form.uploadDir = path.join(lib.tmpDirApp, req.cookies.address);

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
                    } else {
                        config[field] = value;
                    }
                }
            })
            .on('fileBegin', (field, file) => {
                if (field === 'apk')
                    file.path = path.join(form.uploadDir, 'apk', file.name);
                if (field === 'gallery')
                    file.path = path.join(form.uploadDir, 'images' , 'gallery', file.name);
                if (field === 'banner')
                    file.path = path.join(form.uploadDir, 'images', 'banner', file.name);
                if (field === 'logo')
                    file.path = path.join(form.uploadDir, 'images', 'logo', file.name);
            })
            .on('file', (field, file) => {
                let url = path.relative(form.uploadDir, file.path).replace(/\\/g, "\/");
                if (field === 'apk')
                    config.files.apk = url;
                if (field === 'logo')
                    config.files.images.logo = url;
                if (field === 'gallery')
                    config.files.images.gallery.push(url);
                if (field === 'banner')
                    config.files.images.banner = url;
            })
            .on('end', async() => {
                await fse.outputJson(form.uploadDir + '/config/config.json', config);
                resolve(config);
            })
    })
}

module.exports = router;
