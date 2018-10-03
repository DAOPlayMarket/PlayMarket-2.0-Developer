const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
const IPFS = require('ipfs');
const makeDir = require('make-dir');

/** GLOBAL VARIABLES **/
global.lib = require(path.join(__dirname, '..', 'lib'));
global.modules = require(path.join(__dirname, '..', 'modules'));

/** INIT APP **/
const app = express();

/** INIT IPFS **/
global.nodeIPFS = new IPFS({
    repo: lib.ipfs.repo,
    config: lib.ipfs.config
});
nodeIPFS.on('error', (e)=>{
    console.log('error:', modules.time.timeNow(), e.message);
    process.exit(1);
});

/** MIDDLEWARE **/
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// cors
app.use(cors());

/** STATIC FOLDERS **/
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

/** ROUTES **/
app.use('/api', require('../routes'));
app.use("*", function(req, resp) {
    resp.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

(async () => {
    try {
        nodeIPFS.on('start', async() => {
            console.log('IPFS start successful');
            await Promise.all([
                makeDir(lib.dirApp),
                makeDir(lib.dirICO)
            ]);
            console.log('Data folder structure will be created');
            let PORT = process.env.PORT || lib.server.port;
            let HOST = process.env.HOST || lib.server.host;
            app.listen(PORT, HOST, () => {
                // console.info(process.env.NODE_ENV);
                console.info(`Server listening on ${HOST}:${PORT} | ${modules.time.timeNow()}`);
            });
        });
    } catch (err) {
        console.error(`error ${modules.time.timeNow()}`, err);
        process.exit(1);
    }
})();