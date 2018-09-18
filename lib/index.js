const path = require('path');

module.exports = {
    server: {
        host: '127.0.0.1',
        port: '8090'
    },
    dirApp: path.join(__dirname, '..', 'data', 'tmp', 'app'),
    // dirICO: path.join(__dirname, '..', 'data', 'ico')
    ipfs: {
        repo: path.join(__dirname, '..', 'data', '.jsipfs'),
        config: {
            Addresses: {
                Swarm: [
                    "/ip4/0.0.0.0/tcp/4022"
                ]
            },
            Bootstrap: [
                '/ip4/127.0.0.1/tcp/4002/ipfs/QmUwoEzrPSSPVAVKGQQk5vaugAcfEFsLHEhqH7R46Lw4Ya',
                '/ip4/138.197.186.17/tcp/4002/ipfs/QmQnjH4cbTMUiKDUt4RV6ySNfnBEbctwRZUdW1Ms6Aicsa'
            ]
        }
    }
};