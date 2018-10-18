const path = require('path');

module.exports = {
    server: {
        host: '127.0.0.1',
        port: '5002'
    },
    node: {
        txtRecordsServer : 'testnet.playmarket.io',
        prefix : 't'
    },
    dirApp: path.join(__dirname, '..', 'data', 'tmp', 'app'),
    dirICO: path.join(__dirname, '..', 'data', 'tmp', 'ico'),
    ipfs: {
        repo: path.join(__dirname, '..', 'data', '.jsipfs'),
        config: {
            Addresses: {
                Swarm: [
                    "/ip4/0.0.0.0/tcp/6003"
                ]
            },
            Bootstrap: [
                '/ip4/192.168.88.211/tcp/6004/ipfs/QmdnmdHAjNN7DiT38HPYyii8e8jb4hVdH8piAa7XKRkeb4', // home test verify
                '/ip4/109.194.37.82/tcp/6004/ipfs/QmdnmdHAjNN7DiT38HPYyii8e8jb4hVdH8piAa7XKRkeb4', // home test verify ext
                '/ip4/192.168.88.232/tcp/6002/ipfs/QmRunA2TDQ38zVUsCiLqqcTkaZ14pgN7VAgSm5x8E5FJSC', //home test node,
                '/ip4/109.194.37.82/tcp/6002/ipfs/QmRunA2TDQ38zVUsCiLqqcTkaZ14pgN7VAgSm5x8E5FJSC' //home test node ext
            ]
        }
    }
};