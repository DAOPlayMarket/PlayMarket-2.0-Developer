const router = require('express').Router();
const axios = require('axios');

/** UTILS **/
const sender = require('../utils/sender');

/** ROUTES **/
router.get('/:id', async(req, res, next) => {
    try {
        let result = await sender.sendRequestToNode({
            method: 'post',
            route: 'get-app',
            body: {
                idApp: req.params.id
            }
        });

        console.log('result:', result);

        let category = categories.getCategory(result.result.idCTG);
        let subCategory = categories.getSubCategory(category.subcategories, result.result.subCategory);

        res.render('pages/app', {
            page: 'app',
            title: result.result.nameApp,
            server: lib.nodeAddress,
            category: {
                id: category.id,
                name: category.name
            },
            subCategory: {
                id: subCategory.id,
                name: subCategory.name
            },
            app: result.result,
        });
    } catch(e) {
        console.log('error', modules.timeNow(), e.toString());
        next(e);
    }
});

module.exports = router;
