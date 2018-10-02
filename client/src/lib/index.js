module.exports = {
    contracts: {
        PlayMarket: {
            address: '0x125f5bc80B286D481A4B23B4397d1E56a6eadA5a',
            abi: require('./abi/PlayMarket.js')
        },
        main: {
            address: '0x857A6198520aFd1B6Cba74a9313A57B6F07743BD',
            abi: require('./abi/main.js')
        },
        dev: {
            address: '0x15f86b968caA9F660ec076cab80cE228e1597DDe',
            abi: require('./abi/dev.js')
        }
    },
    web3: {
        infura: 'wss://rinkeby.infura.io/ws',
        metamask: '127.0.0.1'
    }
};

