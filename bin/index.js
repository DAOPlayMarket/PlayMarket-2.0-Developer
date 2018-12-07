const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const IPFS = require('ipfs');
const makeDir = require('make-dir');
const nocache = require('nocache');
const requestIp = require('request-ip');
const PeerId = require('peer-id');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});

/** GLOBAL VARIABLES **/
global.lib = require(path.join(__dirname, '..', 'lib'));
global.modules = require(path.join(__dirname, '..', 'modules'));

/** INIT APP **/
const app = express();

const PATH_IPFS_PRIVKEY = lib.path.IPFS.privateKey;
(async () =>{
    try {
        console.log('*************** START ***************');
        let privateKey = '';
        let filepath = path.join(PATH_IPFS_PRIVKEY, 'ipfs.json');
        if (fs.existsSync(filepath)) {
            let PEER_ID = JSON.parse(fs.readFileSync(filepath).toString());
            privateKey = PEER_ID.privKey;
            console.log('> IPFS using existing PeerID');
        } else {
            let PEER_ID = await createPeerID();
            await makeDir(PATH_IPFS_PRIVKEY);
            fs.writeFileSync(filepath, JSON.stringify(PEER_ID, null, 2));
            privateKey = PEER_ID.privKey;
            console.log('> IPFS create new PeerID');
        }

        global.nodeIPFS = new IPFS({
            repo: lib.ipfs.repo,
            config: lib.ipfs.config,
            start: false,
            init: {
                privateKey: privateKey
            }
        });
    } catch (e) {
        console.log('error:', modules.time.timeNow(), e);
        process.exit(1);
    }
})();

nodeIPFS.on('ready', async () => {
    console.log('IPFS ready. PeerID: ' + (await nodeIPFS.id()).id);
    await nodeIPFS.start();
    console.log('IPFS started');
    await Promise.all([
        makeDir(lib.dirApp),
        makeDir(lib.dirICO)
    ]);
    console.log('Data folder structure will be created');
    const PORT = process.env.SERVER_PORT || '127.0.0.1';
    const HOST = process.env.SERVER_HOST || '3001';
    app.listen(PORT, HOST, () => {
        console.info(`Server listening on ${HOST}:${PORT} | ${modules.time.timeNow()}`);
    });
});
nodeIPFS.on('error', e => {
    throw e;
});

/** MIDDLEWARE **/
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// cors
app.use(cors());
// nocache
app.use(nocache());
// ip
app.use(requestIp.mw());

/** STATIC FOLDERS **/
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

/** ROUTES **/
app.use('/api', require('../routes'));
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

function createPeerID() {
    return new Promise((resolve, reject) => {
        PeerId.create({bits: 1024}, (e, PEER_ID) => {
            if (e) {
                reject(e);
            } else {
                resolve(PEER_ID.toJSON());
            }
        });
    })
}