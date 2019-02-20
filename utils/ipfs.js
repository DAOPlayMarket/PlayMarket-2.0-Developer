const readdir = require("recursive-readdir");
const path = require('path');
const fse = require('fs-extra');
const pull = require('pull-stream');
const makeDir = require('make-dir');
const BN = require('bignumber.js');

const upload = (dir, headFolderName) => {
    return new Promise(async(resolve, reject) => {
        try {
            let files = await readdir(dir);
            let arr = [];
            for (let file of files) {
                arr.push(
                    {
                        path: (path.join(headFolderName, path.relative(dir, file))).replace(/\\/g, "\/"),
                        content: fse.readFileSync(file)
                    }
                );
            }
            const stream = ipfsAPI.addPullStream();
            pull(
                pull.values(arr),
                stream,
                pull.collect((e, values) => {
                    if (e) {
                        reject(e)
                    }
                    resolve({
                        hashType: 1,
                        hash: values[values.length-1].hash
                    });
                })
            )
        } catch (e) {
            reject(e);
        }
    });
};

const download = async (dir, multihash) => {
    try {
        console.log('*** Hash IPFS: ' + multihash + ', poll of nodes...');
        const hashStat = await ipfsAPI.object.stat(multihash);
        console.log('*** Hash is find. Size ~ ' + new BN(hashStat.CumulativeSize).div(1024).div(1024).decimalPlaces(2) + ' MB. Downloading...');
        const files = await ipfsAPI.get(multihash);
        // await ipfsAPI.pin.add(multihash);
        console.log('*** Hash has been download. Saving to static...');
        // console.log('*** Hash has been download and pinned. Saving to static...');
        for (const file of files) {
            const filePath = path.join((file.path).replace(multihash, ''));
            switch (typeof file.content) {
                case 'undefined': {
                    await makeDir(path.join(dir, filePath));
                    break;
                }
                default: {
                    fse.writeFileSync(path.join(dir, filePath), file.content);
                    break;
                }
            }
        }
        console.log('*** Hash has been saved to static');
    } catch (e) {
        throw e;
    }
};

module.exports = {
    upload: upload,
    download: download
};