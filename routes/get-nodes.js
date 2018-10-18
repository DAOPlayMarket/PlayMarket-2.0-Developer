const router = require('express').Router();
const dns = require('dns');

router.get('/', async (req, res) => {
    console.log(`/get-nodes [${req.method}] ${modules.time.timeNow()}`);
    try {
        let recordsArr = await resolveTxt(lib.node.txtRecordsServer);

        let recordsStr = ([].concat(...recordsArr)).toString().replace(/,/g, '');
        recordsStr = recordsStr.slice(0, recordsStr.length-1);

        let records = recordsStr.split('|');

        let result = [];
        for (let item of records) {
            let number = item.split(':')[0];
            let lat = item.split(':')[1];
            let long = item.split(':')[2];
            let domain  = lib.node.prefix + number + '.playmarket.io';
            try {
                let ip = await lookup(domain);
                result.push({
                    ip: ip,
                    lat: lat,
                    long: long,
                    domain : domain
                });
            } catch (err) {
                // console.log('error: can\'t get address info for ' + domen);
            }
        }
        res.json({
            result: result,
            status: 200
        });
    } catch(err) {
        console.error(`error ${modules.time.timeNow()}`, err);
        res.json({message: err.toString(), status: 500});
    }
});

function resolveTxt(domain) {
    return new Promise((resolve, reject) => {
        dns.resolveTxt(domain, (err, records) => {
            if (err) {
                reject(err);
            } else {
                resolve(records);
            }
        });
    });
}
function lookup(domain) {
    return new Promise((resolve, reject) => {
        dns.lookup(domain, (err, address) => {
            if (err) {
                reject(err);
            } else {
                resolve(address);
            }
        });
    });
}

module.exports = router;