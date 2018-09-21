import { categories } from '../lib/categories.js'

const initState = {
    node: {
        url: 'https://n000002.playmarket.io:3000'
    },
    isAuth: false,
    user: {
        keystore: '',
        address: '',
        name: '',
        info: ''
    },
    isLoading: false,
    gasPrice: '',
    categories: categories
};

const rootReducer = (state = initState, action) => {
    switch (action.type) {
        case 'AUTH_LOGIN':
            state = {
                ...state,
                isAuth: true,
                user: {
                    keystore: action.keystore,
                    address: action.address,
                    name: action.name,
                    info: action.info
                }
            };
            break;
        case 'AUTH_LOGOUT':
            state = {
                ...state,
                isAuth: false,
                user: {
                    keystore: '',
                    address: '',
                    name: '',
                    info: ''
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
        default:
            break;
    }
    return state;
};

export default rootReducer