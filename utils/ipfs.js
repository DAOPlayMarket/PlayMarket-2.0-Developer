const readdir = require("recursive-readdir");
const path = require('path');
const fse = require('fs-extra');
const pull = require('pull-stream');
const makeDir = require('make-dir');

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

const download = (dir, multiHash) => {
    return new Promise(async (resolve, reject) => {
        try {
            let stream = nodeIPFS.files.getReadableStream(multiHash);
            console.log('Load files START:', multiHash);
            stream.on('data', async file => {
                stream.pause();
                let filePath = path.join((file.path).replace(multiHash,''));
                switch (file.type) {
                    case 'dir':
                        await makeDir(path.join(dir, filePath));
                        break;
                    case 'file':
                        await new Promise(async (resolve, reject) => {
                            try {
                                let ws = fse.createWriteStream(path.join(dir, filePath));
                                file.content.pipe(ws);
                                ws.on('error', e => {
                                    ws.end();
                                    throw e;
                                });
                                ws.on('close', () => {
                                    resolve();
                                });
                            } catch (e) {
                                reject(e);
                            }
                        });
                        break;
                    default:
                        break;
                }
                stream.resume();
            });
            stream.on('end', () => {
                console.log('Load files END:', multiHash);
                resolve();
            });
            setTimeout(() => {
                reject(new Error('Disconnection by timeout'));
            }, 600000);
        } catch (e) {
            reject(e);
        }
    });
};

// const download = async (dir, multiHash) => {
//     let timeout = setTimeout(() => {
//         throw new Error('Disconnection by timeout');
//     }, 1200000);
//     try {
//         console.log('*** Downloading from IPFS, hash: ' + multiHash);
//         let result = {};
//         let files = await nodeIPFS.files.get(multiHash);
//         for (let file of files) {
//             let filePath = path.join((file.path).replace(multiHash,''));
//             switch (file.type) {
//                 case 'dir':
//                     await makeDir(path.join(dir, filePath));
//                     break;
//                 case 'file':
//                     fse.writeFileSync(path.join(dir, filePath), file.content);
//                     if(file.name === 'config.json') {
//                         result.config = JSON.parse(file.content.toString());
//                     }
//                     break;
//                 default:
//                     break;
//             }
//         }
//         clearTimeout(timeout);
//         return result;
//     } catch (e) {
//         clearTimeout(timeout);
//         throw e;
//     }
// };

module.exports = {
    upload: upload,
    download: download
};