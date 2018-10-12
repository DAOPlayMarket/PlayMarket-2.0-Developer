const router = require('express').Router();
const del = require('del');
const path = require('path');
const makeDir = require('make-dir');
const fse = require('fs-extra');
const formidable = require('formidable');
const ApkReader = require('adbkit-apkreader');

/** UTILS **/
const ipfs = require(path.join(__dirname, '..', 'utils', 'ipfs.js'));

router.post('/', async (req, res) => {
    console.log(`/update-apk [${req.method}] ${modules.time.timeNow()}`);
    try {
        let address = req.header('address');
        let payload = JSON.parse(req.header('data'));

        const dir = path.join(lib.dirApp, address);

        await del(dir);
        await makeDir(dir);

        await ipfs.download(dir, payload.hash);

        await del(path.join(dir, 'apk', '**.*'));

        let data = await formidablePromise(req, {address: address});

        let readerAPK = await ApkReader.open(path.join(dir, data.apk));
        let manifest = await readerAPK.readManifest();

        let config = JSON.parse(fse.readFileSync(path.join(dir, 'config', 'config.json')));

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

        await del(path.join(dir, 'config', '**.*'));

        config.version = manifest.versionCode;
        config.files.apk = data.apk;
        let changelog = {
            version: manifest.versionCode,
            description: data.description
        };
        if( "changelog" in config && Array.isArray(config.changelog)) {
            config.changelog.push(changelog);
        } else {
            config.changelog = [changelog]
        }

        await fse.outputJson(path.join(dir, 'config', 'config.json'), config);

        let result = await ipfs.upload(dir, 'app');

        await del(dir);

        res.json({
            result: result,
            status: 200
        });
    } catch(err) {
        console.error(`error ${modules.time.timeNow()}`, err);
        res.json({result: err.toString(), status: 500});
    }
});

function formidablePromise(req, data) {
    return new Promise((resolve, reject) => {
        try {
            let form = new formidable.IncomingForm();

            let obj = {
                apk: '',
                description: ''
            };

            form.multiples = false;
            form.uploadDir = path.join(lib.dirApp, data.address);

            form.parse(req);
            form
                .on('error', (err) => {
                    reject(err);
                })
                .on('field', (field, value) => {
                    if (value !== 'undefined') {
                        switch (field) {
                            case 'description':
                                obj[field] = value;
                                break;
                            case 'apk':
                                break;
                            default:
                                break;
                        }
                    }
                })
                .on('fileBegin', (field, file) => {
                    if (field === 'apk')
                        file.path = path.join(form.uploadDir, 'apk', file.name);
                })
                .on('file', (field, file) => {
                    if (field === 'apk')
                        obj.apk = path.relative(form.uploadDir, file.path).replace(/\\/g, "\/");
                })
                .on('end', () => {
                    resolve(obj);
                })
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = router;