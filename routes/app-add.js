const router = require('express').Router();
const formidable = require('formidable');
const del = require('del');
const makeDir = require('make-dir');
const path = require('path');
const fse = require('fs-extra');
const ApkReader = require('adbkit-apkreader');

/** UTILS **/
const ipfs = require(path.join(__dirname, '..', 'utils', 'ipfs.js'));

router.post('/', async (req, res) => {
    console.log(`/app-add [${req.method}] ${modules.time.timeNow()}`);
    try {
        let address = req.header('address');
        await del(path.join(lib.dirApp, address), {force: true});
        await Promise.all([
            makeDir(path.join(lib.dirApp, address, 'apk')),
            makeDir(path.join(lib.dirApp, address, 'config')),
            makeDir(path.join(lib.dirApp, address, 'images', 'logo')),
            makeDir(path.join(lib.dirApp, address, 'images', 'gallery')),
            makeDir(path.join(lib.dirApp, address, 'images', 'banner'))
        ]);
        let config = await formidablePromise(req, {address: address});

        let parserAPK = await ApkReader.open(path.join(lib.dirApp, address, config.files.apk));
        let manifest = await parserAPK.readManifest();

        config.version = manifest.versionCode;
        config.packageName = manifest.package;

        await fse.outputJson(path.join(lib.dirApp, address, 'config', 'config.json'), config);

        let result = await ipfs.upload(path.join(lib.dirApp, address), 'app');
        await del(path.join(lib.dirApp, address), {force: true});

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
            form.uploadDir = path.join(lib.dirApp, data.address);

            form.parse(req);
            form
                .on('error', (err) => {
                    if (err) return reject(err)
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
                    resolve(config);
                })
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = router;