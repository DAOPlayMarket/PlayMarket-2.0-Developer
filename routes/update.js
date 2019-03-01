const router = require('express').Router();
const formidable = require('formidable');
const del = require('del');
const makeDir = require('make-dir');
const path = require('path');
const fse = require('fs-extra');
// const ApkReader = require('adbkit-apkreader');

/** UTILS **/
const ipfs = require(path.join(__dirname, '..', 'utils', 'ipfs.js'));

router.post('/', async (req, res) => {
    console.log(`/update [${req.method}] ${modules.time.timeNow()}`);
    try {
        const address = req.header('address');

        const dir = path.join(lib.dirApp, address);

        await Promise.all([
            makeDir(path.join(dir, 'apk')),
            makeDir(path.join(dir, 'config')),
            makeDir(path.join(dir, 'images', 'logo')),
            makeDir(path.join(dir, 'images', 'gallery')),
            makeDir(path.join(dir, 'images', 'banner'))
        ]);

        const config = JSON.parse(fse.readFileSync(path.join(dir, 'config', 'config.json')));
        await del(path.join(dir, 'config', '**.*'));

        let data = await formidablePromise(req, {address: address, dir: dir});

        const mergedConfig = {...config, ...data};

        await fse.outputJson(path.join(dir, 'config', 'config.json'), mergedConfig);

        const result = await ipfs.upload(dir, 'app', true);

        await del(dir, {force: true});

        res.json({
            result: result,
            status: 200
        });
    } catch(err) {
        console.error(`error ${modules.time.timeNow()}`, err);
        res.json({message: err.toString(), status: 500});
    }
});

function formidablePromise(req, data) {
    return new Promise((resolve, reject) => {
        try {
            let form = new formidable.IncomingForm();

            let config = {
                // size: 0,
                // files: {
                //     apk: null,
                //     images: {
                //         banner: null,
                //         gallery: [],
                //         logo: null
                //     }
                // }
            };

            form.multiples = true;
            form.uploadDir = data.dir;

            form.parse(req);
            form
                .on('error', (err) => {
                    reject(err);
                })
                .on('field', (field, value) => {
                    if (value !== 'undefined') {
                        switch (field) {
                            case 'keywords':
                                config[field] = JSON.parse(value);
                                break;
                            case 'apk':
                            case 'banner':
                            case 'logo':
                                break;
                            default:
                                config[field] = value;
                                break;
                        }
                    }
                })
                // .on('fileBegin', (field, file) => {
                //     if (field === 'apk')
                //         file.path = path.join(form.uploadDir, 'apk', file.name);
                //     if (field === 'gallery')
                //         file.path = path.join(form.uploadDir, 'images' , 'gallery', file.name);
                //     if (field === 'banner')
                //         file.path = path.join(form.uploadDir, 'images', 'banner', file.name);
                //     if (field === 'logo')
                //         file.path = path.join(form.uploadDir, 'images', 'logo', file.name);
                // })
                // .on('file', (field, file) => {
                //     const url = path.relative(form.uploadDir, file.path).replace(/\\/g, "\/");
                //     if (field === 'apk') {
                //         config.size = file.size;
                //         config.files.apk = url;
                //     }
                //     if (field === 'logo')
                //         config.files.images.logo = url;
                //     if (field === 'gallery')
                //         config.files.images.gallery.push(url);
                //     if (field === 'banner')
                //         config.files.images.banner = url;
                // })
                .on('end', () => {
                    resolve(config);
                })
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = router;