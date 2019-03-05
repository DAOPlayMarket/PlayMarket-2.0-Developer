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

        let mergedConfig = {...config, ...data.config};

        if (data.files.apk) {
            const readerAPK = await ApkReader.open(path.join(dir, data.files.apk));
            const manifest = await readerAPK.readManifest();

            await del(path.join(dir, config.files.apk));
            if (config.packageName !== manifest.package) {
                await del(dir);
                return res.json({
                    message: 'Are you trying to update the app, where the package name is not equal to the previous version of the application. Please make sure in choosing the correct APK file',
                    status: 400
                });
            }
            if (parseInt(config.version) >= parseInt(manifest.versionCode)) {
                await del(dir);
                return res.json({
                    message: 'Are you trying to update the application, where the version code is less than or equal to the previous version of the application. Please make sure in choosing the correct APK file',
                    status: 400
                });
            }

            mergedConfig.version = manifest.versionCode;
            mergedConfig.versionName = manifest.versionName;
            mergedConfig.size = data.sizeAPK;
            mergedConfig.files.apk = data.files.apk;

            if (data.changelog_text) {
                const changelog = {
                    versionCode: manifest.versionCode,
                    versionName: manifest.versionName,
                    description: data.changelog_text
                };
                if( "changelog" in mergedConfig && Array.isArray(mergedConfig.changelog)) {
                    mergedConfig.changelog.push(changelog);
                } else {
                    mergedConfig.changelog = [changelog]
                }
            }
        }
        if (data.files.images.banner) {
            await del(path.join(dir, config.files.images.banner));
            mergedConfig.files.images.banner = data.files.images.banner;
        }
        if (data.files.images.logo) {
            await del(path.join(dir, config.files.images.logo));
            mergedConfig.files.images.logo = data.files.images.logo;
        }

        if (data.removed_gallery.length !== 0) {
            for (const item of data.removed_gallery) {
                await del(path.join(dir, item));
                mergedConfig.files.images.gallery = mergedConfig.files.images.gallery.filter(el => el !== item);
            }
        }

        if (data.files.images.gallery.length !== 0) {
            for (const item of data.files.images.gallery) {
                mergedConfig.files.images.gallery.push(item);
            }
        }

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

            let config = {};
            let files = {
                apk: null,
                images: {
                    banner: null,
                    gallery: [],
                    logo: null
                }
            };
            let sizeAPK = 0;
            let changelog_text = null;
            let removed_gallery = [];

            form.multiples = true;
            form.uploadDir = data.dir;
            form.hash = 'md5';

            form.parse(req);
            form
                .on('error', (err) => {
                    reject(err);
                })
                .on('field', async (field, value) => {
                    if (value !== 'undefined') {
                        switch (field) {
                            case 'removed_gallery_files': {
                                removed_gallery = JSON.parse(value);
                                break;
                            }
                            case 'changelog_text':
                                changelog_text = value;
                                break;
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
                        file.path = path.join(form.uploadDir, 'apk', Date.now().toString());
                    if (field === 'gallery')
                        file.path = path.join(form.uploadDir, 'images' , 'gallery', Date.now().toString());
                    if (field === 'banner')
                        file.path = path.join(form.uploadDir, 'images', 'banner', Date.now().toString());
                    if (field === 'logo')
                        file.path = path.join(form.uploadDir, 'images', 'logo', Date.now().toString());
                })
                .on('file', (field, file) => {
                    if (field === 'apk') {
                        sizeAPK = file.size;
                        const new_path = path.join(file.path, '..', file.name);
                        fse.renameSync(file.path, new_path);
                        files.apk = path.relative(form.uploadDir, new_path).replace(/\\/g, "\/");
                    }
                    if (field === 'logo') {
                        const new_path = path.join(file.path, '..', file.hash + path.extname(file.name));
                        fse.renameSync(file.path, new_path);
                        files.images.logo = path.relative(form.uploadDir, new_path).replace(/\\/g, "\/");
                    }
                    if (field === 'gallery') {
                        const new_path = path.join(file.path, '..', file.hash + path.extname(file.name));
                        fse.renameSync(file.path, new_path);
                        files.images.gallery.push(path.relative(form.uploadDir, new_path).replace(/\\/g, "\/"));
                    }
                    if (field === 'banner') {
                        const new_path = path.join(file.path, '..', file.hash + path.extname(file.name));
                        fse.renameSync(file.path, new_path);
                        files.images.banner = path.relative(form.uploadDir, new_path).replace(/\\/g, "\/");
                    }
                })
                .on('end', () => {
                    resolve({
                        config: config,
                        files: files,
                        sizeAPK: sizeAPK,
                        changelog_text: changelog_text,
                        removed_gallery: removed_gallery
                    });
                })
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = router;