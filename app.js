const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const expressValidator = require('express-validator');
const i18n = require("i18n");
const IPFS = require('ipfs');

/** CONFIG **/
const CONFIG_VALIDATOR = require('./config/validator');
const CONFIG_i18n = require('./config/i18n');

/** GLOBAL VARIABLES **/
global.lib = require(path.join(__dirname, 'lib'));
global.categories = require(path.join(__dirname, 'lib', 'categories'));
global.modules = require(path.join(__dirname, 'modules'));

/** INIT APP **/
const app = express();

/** INIT IPFS **/
global.nodeIPFS = new IPFS({
    repo: lib.ipfs.repo,
    config: lib.ipfs.config
});
nodeIPFS.on('error', (e)=>{
    console.log('error:', modules.timeNow(), e.message);
    process.exit(1);
});

/** VIEW ENGINE **/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/** MIDDLEWARE **/
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// cookie
app.use(cookieParser());
// validator
app.use(expressValidator(CONFIG_VALIDATOR));
// languages
i18n.configure(CONFIG_i18n);
app.use(i18n.init);

/** PUBLIC FOLDER **/
app.use(express.static(lib.publicFolder));
app.use(express.static(lib.appDir));

/** ROUTES **/
app.use('/', require('./routes'));

/** START APP **/
(async () => {
    try {
        nodeIPFS.on('start', async() => {
            console.log(modules.divider('\u2505', 24, ' '));
            console.log(modules.timeNow());
            console.log('\u2714 IPFS start successful');
            app.listen(lib.server.port, lib.server.host, () => {
                console.log('\u2714 Server start successful');
                console.log(modules.divider('\u2505', 24, ' '));
            });
        });
    } catch (e) {
        console.log('error:', modules.timeNow(), e.message);
        process.exit(1);
    }
})();


