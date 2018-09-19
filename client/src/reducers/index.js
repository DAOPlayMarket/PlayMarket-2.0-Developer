import { categories } from '../lib/categories.js'

const initState = {
    node: {
        url: 'https://n000002.playmarket.io:3000'
    },
    isAuth: true,
    user: {
        keystore: '',
        address: '0x5cfdffa814ad9761295d7d90aca47a3a97bcb64d',
        name: '',
        info: ''
    },
    isLoading: false,
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
        default:
            break;
    }
    return state;
};

export default rootReducer