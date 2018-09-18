const moment = require('moment-timezone');

exports.timeNow = () => {
    let zone = moment.tz.guess();
    return moment().tz(zone).format(`[[Date: ]DD.MM.YYYY, [Time: ]HH:mm:ss, [Zone: ${zone}]]`);
};