const moment = require('moment-timezone');
require('moment-countdown');

// TIME
exports.timeNow = () => {
    return moment().tz("Asia/Hovd").format('[[Date: ]DD.MM.YYYY, [Time: ]HH:mm:ss[]]');
};
exports.timeTo = (time) => { // '2017-11-09'
    return moment(time).countdown();
};

// DIVIDER
exports.divider = (type, length, space) => {
    let output = '';
    for (let i = 0; i < length; i++) {
        output = output + ((i === 0) ? '' : space) + type;
    }
    return output
};

exports.randomString = (len) => {
    let buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (let i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

