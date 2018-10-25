const path = require('path');

module.exports = {
    node: {
        txtRecordsServer : 'mainnet.playmarket.io',
        prefix : 'm'
    },
    dirApp: path.join(__dirname, '..', 'data', 'tmp', 'app'),
    dirICO: path.join(__dirname, '..', 'data', 'tmp', 'ico'),
    ipfs: {
        repo: path.join(__dirname, '..', 'data', '.jsipfs'),
        config: {
            Addresses: {
                Swarm: [
                    "/ip4/0.0.0.0/tcp/4003"
                ]
            },
            Bootstrap: [
                '/ip4/109.194.37.82/tcp/4004/ipfs/QmbdY5KnhG6Dk5fEJZQSVDhHN7sdhSzsKMnJU6MnpmRg5h', // tomsk verify
                '/ip4/192.168.88.211/tcp/4004/ipfs/QmbdY5KnhG6Dk5fEJZQSVDhHN7sdhSzsKMnJU6MnpmRg5h', // tomsk verify local
                '/ip4/109.194.37.82/tcp/4002/ipfs/QmQCH7nuh5osaTj2BDKThL54fBJiQ8d5YMPcTokEP3dRem', // tomsk node
                '/ip4/192.168.88.232/tcp/4002/ipfs/QmQCH7nuh5osaTj2BDKThL54fBJiQ8d5YMPcTokEP3dRem', // tomsk node local
                '/ip4/142.93.222.213/tcp/4002/ipfs/QmSBK4eUbTjYBhzYCH5SnXtpRAtHyU1RJD9jYQSJuuVyHt', // bangalor node
                '/ip4/178.128.231.195/tcp/4002/ipfs/QmbgT7FAyZCUAtzEuDmiW4LZzEasLogXp2TnZwuT2qq7i4', // toronto node
                '/ip4/178.128.139.121/tcp/4002/ipfs/QmUjq62GWd4dAFrC44FQrv4eWsVTpsq8Cd8NprsLHw1e7W', // amsterdam node
                '/ip4/178.128.129.130/tcp/4002/ipfs/QmbLSR7TYzgpCGuqSui5Ysi3rLiUbpGDR4yBvJKGeLX5Ry', // san-francisco node
                '/ip4/176.99.11.18/tcp/4002/ipfs/QmX8aSmP6j6HmXxkTZZBTJNv8yPJ1pU7bTRFyf83SQft2h', // moscow node
                '/ip4/68.183.48.35/tcp/4002/ipfs/QmXgGb3ZsgE3Py2JBtwMBLYNbbe7iUrCwQj79nHTrFBaNE', // new-york node
                '/ip4/13.237.66.130/tcp/4002/ipfs/QmZYwAmU85NrZQYfoauRhoHmAwpPzUWwatx4zNsXxyQpe1', // sydney node
                '/ip4/18.179.56.255/tcp/4002/ipfs/Qmefm21hnSenCdtiux3VnzJLXeDUunwW3NS1Mx974SZoZx' // tokyo node
            ]
        }
    }
};