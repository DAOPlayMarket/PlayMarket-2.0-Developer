const initState = {
    node: {
        url: '',
        lat: '',
        long: '',
        ip: '',
        domain: ''
    },
    nodes: [],
    isAuth: false,
    user: {
        keystore: '',
        address: '',
        name: '',
        desc: '',
        position: {
            lat: '',
            long: ''
        }
    },
    contracts: {
        Proxy: {
            address: '0x3A7075f150162d83EB2422735dfE6326b745c25B',
            abi: require('../lib/abi/Proxy.js')
        },
        PlayMarket: {
            address: '',
            abi: require('../lib/abi/PlayMarket.js')
        },
        ICO: {
            address: '',
            abi: require('../lib/abi/ICO.js')
        },
        ICOList: {
            address: '',
            abi: require('../lib/abi/ICOList.js')
        },
        version: '',
        endTime: '',
        number: ''
    },
    isLoading: false,
    gasPrice: '',
    mode: '',
    categories: require('../lib/other/categories.js')
};

const rootReducer = (state = initState, action) => {
    switch (action.type) {
        case 'SET_CONTRACTS':
            state = {
                ...state,
                contracts: {
                    ...state.contracts,
                    version: action.version,
                    PlayMarket: {
                        ...state.contracts.PlayMarket,
                        address: action.PlayMarket
                    },
                    ICO: {
                        ...state.contracts.ICO,
                        address: action.ICO
                    },
                    ICOList: {
                        ...state.contracts.ICOList,
                        address: action.ICOList
                    },
                    endTime: action.endTime,
                    number: action.number
                }
            };
            break;
        case 'SET_MODE':
            state = {
                ...state,
                mode: action.mode
            };
            break;
        case 'USER_LOGIN':
            state = {
                ...state,
                isAuth: true,
                user: {
                    ...state.user,
                    keystore: action.keystore,
                    address: action.address,
                    name: action.name,
                    desc: action.desc
                }
            };
            break;
        case 'USER_LOGOUT':
            state = {
                ...state,
                isAuth: false,
                user: {
                    ...state.user,
                    keystore: '',
                    address: '',
                    name: '',
                    info: ''
                }
            };
            break;
        case 'USER_CHANGE_INFO':
            state = {
                ...state,
                user: {
                    ...state.user,
                    name: action.name,
                    desc: action.desc
                }
            };
            break;
        case 'SET_USER_POSITION':
            state = {
                ...state,
                user: {
                    ...state.user,
                    position: {
                        lat: action.lat,
                        long: action.long
                    }
                }
            };
            break;
        case 'START_LOADING':
            state = {
                ...state,
                isLoading: true
            };
            break;
        case 'END_LOADING':
            state = {
                ...state,
                isLoading: false
            };
            break;
        case 'SET_GAS_PRICE':
            state = {
                ...state,
                gasPrice: action.gasPrice
            };
            break;
        case 'SET_NODES':
            state = {
                ...state,
                nodes: action.nodes
            };
            break;
        case 'SET_NODE':
            state = {
                ...state,
                node: {
                    domain: action.domain,
                    url: action.url,
                    lat: action.lat,
                    long: action.long,
                    ip: action.ip
                }
            };
            break;
        default:
            break;
    }
    return state;
};

export default rootReducer