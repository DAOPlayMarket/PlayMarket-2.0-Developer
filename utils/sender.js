const axios = require('axios');

const sendRequestToNode = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let options = {
                method: data.method,
                url: lib.nodeAddress + '/api/' + data.route,
                data: data.body
            };
            let result = (await axios(options)).data;
            resolve(result);
        } catch (e) {
            reject(e);
            console.log('error', modules.timeNow(), e.toString());
        }
    });
};

module.exports = {
    sendRequestToNode: sendRequestToNode
};