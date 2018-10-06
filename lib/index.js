const path = require('path');

module.exports = {
    server: {
        host: '127.0.0.1',
        port: '3030'
    },
    dirApp: path.join(__dirname, '..', 'data', 'tmp', 'app'),
    dirICO: path.join(__dirname, '..', 'data', 'tmp', 'ico'),
    ipfs: {
        repo: path.join(__dirname, '..', 'data', '.jsipfs'),
        config: {
            Addresses: {
                Swarm: [
                    "/ip4/0.0.0.0/tcp/4022"
                ]
            },
            Bootstrap: [
                '/ip4/192.168.88.211/tcp/4002/ipfs/QmdNM6A2gTxTGJgjdqLygXvKjcYFtd4Nr8zDGYTjMpbHsQ'
            ]
        }
    }
};