const router = require('express').Router();
const axios = require('axios');
const multer = require('multer');

/** CONFIG **/
const config_info = require('./../lib/info');
const config_abi = require('./../lib/abi');

/** MODULES **/
const modules = require('./../modules');

// const upload = multer({ dest: __dirname + './../data' });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + './../data');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

/** ROUTES **/
router.post('/add', upload.fields([{ name: 'gallery', maxCount: 5 }, { name: 'logo', maxCount: 1 }, { name: 'app', maxCount: 1 }]), async(req, res, next) => {
    try {
        console.log(req.files);
        console.log(req.body);
        res.json({status: 200});
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.get('/add', async(req, res, next) => {
    try {
        let options = {
            method: 'get',
            url: config_info.nodeAddress + '/api/get-categories',
            json: true
        };
        let categories = await axios(options);
        res.render('pages/app-add', {
            page: 'add-app',
            categories: categories
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

router.get('/:id', async(req, res, next) => {
    try {
        let options1 = {
            method: 'get',
            url: config_info.nodeAddress + '/api/get-categories'
        };
        let result1 = (await axios(options1)).data;

        let options2 = {
            method: 'post',
            url: config_info.nodeAddress + '/api/get-app',
            data: {
                idApp: req.params.id
            }
        };
        let result2 = (await axios(options2)).data;

        let type = (result1.result).find(item => item.id === parseInt(result2.result.info.idCTG));
        let category = type.subcategories.find(category => category.id === parseInt(result2.result.info.subCategory));

        res.render('pages/app', {
            page: 'app',
            server: config_info.nodeAddress,
            type: {
                id: type.id,
                name: type.name
            },
            category: {
                id: category.id,
                name: category.name
            },
            app: result2.result,
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});



// idCTG: {type: String},
// nameApp: {type: String},
// advertising: {type: Boolean},
// forChildren: {type: Boolean},
// privacyPolicy: {type: String},
// urlApp: {type: String},
// email: {type: String},
// ageRestrictions: {type: String},
// subCategory: {type: String},
// hashTag: {type: String},
// hash: {type: String},
// adrDev: {type: String},
// value: {type: String, default: '0'}

module.exports = router;
