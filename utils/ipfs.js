const readdir = require("recursive-readdir");
const path = require('path');
const fse = require('fs-extra');

/** MODULES **/
const modules = require('./../modules');

const load = (dir, headFolder) => {
    return new Promise(async(resolve, reject) => {
        try {
            let files = await readdir(dir);
            let stream = nodeIPFS.files.addReadableStream();
            console.log(files);
            for (let file of files) {
                let streamPath = (path.join(headFolder, path.relative(dir, file))).replace(/\\/g, "\/");
                stream.write({
                    path: streamPath,
                    content: fse.readFileSync(file)
                });
            }
            stream.on('error', (e) => {
                reject(e);
            });
            stream.end();
            stream.on('data', (file) => {
                console.log('file.path:', file.path);
                if (file.path === headFolder) {
                    resolve({
                        hashTag: 'IPFS',
                        hash: file.hash
                    });
                }
            });
            stream.on('end', () => {
                console.log('There will be no more data.');
            });
        } catch (e) {
            reject(e);
            console.log('error', modules.timeNow(), e);
        }
    });
};

module.exports.load = load;