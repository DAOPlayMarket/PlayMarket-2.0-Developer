const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const makeDir = require('make-dir');
const nocache = require('nocache');
const clientIPFS = require('ipfs-http-client');

require('dotenv').config({path: path.join(__dirname, '..', '.env')});

global.ipfsAPI = clientIPFS(`${process.env.IPFS_GATEWAY_HOST}`, `${process.env.IPFS_GATEWAY_PORT}`, {protocol: 'http'});

/** GLOBAL VARIABLES **/
global.lib = require(path.join(__dirname, '..', 'lib'));
global.modules = require(path.join(__dirname, '..', 'modules'));

/** INIT APP **/
const app = express();

(async () =>{
    try {
        console.log('IPFS peerID: ' + (await ipfsAPI.id()).id);
        await makeFolderStructure();
        await startServer();
    } catch (e) {
        console.log('error:', modules.time.timeNow(), e);
        process.exit(1);
    }
})();

function startServer() {
    return new Promise ((resolve, reject) => {
        const HOST = process.env.SERVER_HOST || '127.0.0.1';
        const PORT = process.env.SERVER_PORT || '3000';
        app.listen(PORT, HOST, () => {
            console.log('Server listening on ' + HOST + ':' + PORT + ' ' + modules.time.timeNow());
            console.log('---------------------------------------------------------------------');
            resolve();
        }).on('error', e => {
            reject(e);
        });
    });
}
async function makeFolderStructure() {
    try {
        await Promise.all([
            makeDir(lib.dirApp),
            makeDir(lib.dirICO)
        ]);
        console.log('Data folder structure will be created');
    } catch (e) {
        throw e;
    }
}

/** MIDDLEWARE **/
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// cors
app.use(cors());
// nocache
app.use(nocache());

/** STATIC FOLDERS **/
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(express.static(path.join(__dirname, '..', 'data')));

/** ROUTES **/
app.use('/api', require('../routes'));
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});
