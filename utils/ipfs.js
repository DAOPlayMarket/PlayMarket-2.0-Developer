const readdir = require("recursive-readdir");
const path = require('path');
const fse = require('fs-extra');
const pull = require('pull-stream');

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
            const stream = nodeIPFS.files.addPullStream();
            pull(
                pull.values(arr),
                stream,
                pull.collect((err, values) => {
                    if (err) {
                        reject(err)
                    }
                    resolve({
                        hashType: 1,
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

module.exports = {
    upload: upload
};