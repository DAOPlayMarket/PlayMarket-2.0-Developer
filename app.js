const   express             = require('express'),
        path                = require('path'),
        cookieParser        = require('cookie-parser'),
        bodyParser          = require('body-parser'),
        fs                  = require('fs'),
        expressValidator    = require('express-validator'),
        i18n                = require("i18n");

/** CONFIGS **/
const CONFIG_VALIDATOR = require('./config/validator');
const CONFIG_i18n = require('./config/i18n');

/** MODULES **/
const modules = require('./modules');

/** INIT APP **/
const app = express();

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
app.use(express.static(path.join(__dirname, 'public')));

/** ROUTES **/
app.use('/', require('./routes'));

/** START SERVER **/
const host = '192.168.11.247';
const port = '3000';

(async () => {
    try {
        console.log(modules.divider('\u2505', 24, ' '));
        console.log(modules.timeNow());
        app.listen(port, host, () => {
            console.log('\u2714 Server start successful');
            console.log(modules.divider('\u2505', 24, ' '));
        });
    } catch (e) {
        console.log('error:', modules.timeNow(), e.message);
        process.exit(1);
    }
})();


