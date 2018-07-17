const readdir = require("recursive-readdir");
const path = require('path');
const fse = require('fs-extra');
const pull = require('pull-stream');

/** MODULES **/
const modules = require('./../modules');

const load = (dir, headFolder) => {
    return new Promise(async(resolve, reject) => {
        try {
            let files = await readdir(dir);
            let arr = [];
            for (let file of files) {
                arr.push(
                    {
                        path: (path.join(headFolder, path.relative(dir, file))).replace(/\\/g, "\/"),
                        content: fse.readFileSync(file)
                    }
                );
            }
            const stream = nodeIPFS.files.addPullStream();
            pull(
                pull.values(arr),
            stream,
                pull.collect((err, values) => {
                    if (err) {
                        reject(err)
                    }
                    resolve({
                        hashTag: 'IPFS',
                        hash: values[values.length-1].hash
                    });
                })
            )
        } catch (e) {
            reject(e);
            console.log('error', modules.timeNow(), e);
        }
    });
};

module.exports.load = load;