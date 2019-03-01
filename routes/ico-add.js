const router = require('express').Router();
const formidable = require('formidable');
const del = require('del');
const makeDir = require('make-dir');
const path = require('path');
const fse = require('fs-extra');

/** UTILS **/
const ipfs = require(path.join(__dirname, '..', 'utils', 'ipfs.js'));

router.post('/', async (req, res) => {
    console.log(`/ico-add [${req.method}] ${modules.time.timeNow()}`);
    try {
        const address = req.header('address');

        await del(path.join(lib.dirICO, address), {force: true});
        await Promise.all([
            makeDir(path.join(lib.dirICO, address, 'config')),
            makeDir(path.join(lib.dirICO, address, 'images', 'logo')),
            makeDir(path.join(lib.dirICO, address, 'images', 'team')),
            makeDir(path.join(lib.dirICO, address, 'images', 'advisors')),
            makeDir(path.join(lib.dirICO, address, 'images', 'gallery')),
            makeDir(path.join(lib.dirICO, address, 'images', 'banner')),
            makeDir(path.join(lib.dirICO, address, 'images', 'description')),
            makeDir(path.join(lib.dirICO, address, 'images', 'advantages')),
            makeDir(path.join(lib.dirICO, address, 'docs'))
        ]);
        await formidablePromise(req, {address: address});

        const result = await ipfs.upload(path.join(lib.dirICO, address), 'ico', true);

        await del(path.join(lib.dirICO, address), {force: true});

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
        let form = new formidable.IncomingForm();

        let config = {
            members: {
                team: [],
                advisors: []
            },
            files: {
                docs: {
                    whitepaper: null,
                    onepage: null
                },
                images: {
                    description: [],
                    advantages: [],
                    gallery: [],
                    logo: null,
                    banner: null
                }
            }
        };

        form.multiples = true;
        form.uploadDir = path.join(lib.dirICO, data.address);

        form.parse(req);
        form
            .on('error', (err) => {
                if (err) return reject(err)
            })
            .on('field', (field, value) => {
                switch (field) {
                    case 'social':
                    case 'keywords':
                        config[field] = JSON.parse(value);
                        break;
                    case 'team':
                    case 'advisors':
                        let parsedValue = JSON.parse(value);
                        if (parsedValue.photo) {
                            let photoFakePath = path.join(form.uploadDir, 'images', 'team', parsedValue.photo);
                            parsedValue.photo = path.relative(form.uploadDir, photoFakePath).replace(/\\/g, "\/");
                        }
                        config.members[field].push(parsedValue);
                        break;
                    case 'whitepaper':
                    case 'onepage':
                    case 'logo':
                    case 'banner':
                        break;
                    default:
                        config[field] = value;
                        break;
                }
            })
            .on('fileBegin', (field, file) => {
                if (field === 'gallery')
                    file.path = path.join(form.uploadDir, 'images', 'gallery', file.name);
                if (field === 'banner')
                    file.path = path.join(form.uploadDir, 'images', 'banner', file.name);
                if (field === 'logo')
                    file.path = path.join(form.uploadDir, 'images', 'logo', file.name);

                if (field === 'description')
                    file.path = path.join(form.uploadDir, 'images', 'description', file.name);
                if (field === 'advantages')
                    file.path = path.join(form.uploadDir, 'images', 'advantages', file.name);

                if (field === 'team')
                    file.path = path.join(form.uploadDir, 'images', 'team', file.name);
                if (field === 'advisors')
                    file.path = path.join(form.uploadDir, 'images', 'advisors', file.name);

                if (field === 'whitepaper')
                    file.path = path.join(form.uploadDir, 'docs', file.name);
                if (field === 'onepage')
                    file.path = path.join(form.uploadDir, 'docs', file.name);
            })
            .on('file', (field, file) => {
                const url = path.relative(form.uploadDir, file.path).replace(/\\/g, "\/");
                if (field === 'logo')
                    config.files.images.logo = url;
                if (field === 'gallery')
                    config.files.images.gallery.push(url);
                if (field === 'banner')
                    config.files.images.banner = url;
                if (field === 'description')
                    config.files.images.description.push(url);
                if (field === 'advantages')
                    config.files.images.advantages.push(url);
                if (field === 'whitepaper')
                    config.files.docs.whitepaper = url;
                if (field === 'onepage')
                    config.files.docs.onepage = url;
            })
            .on('end', async() => {
                await fse.outputJson(path.join(form.uploadDir, 'config', 'config.json'), config);
                resolve(config);
            })
    })
}

module.exports = router;