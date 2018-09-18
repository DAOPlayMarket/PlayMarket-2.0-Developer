module.exports = {
    contracts: {
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

