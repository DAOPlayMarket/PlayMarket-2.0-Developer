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
        desc: ''
    },
    isLoading: false,
    gasPrice: '',
    categories: categories
};

const rootReducer = (state = initState, action) => {
    switch (action.type) {
        case 'USER_LOGIN':
            state = {
                ...state,
                isAuth: true,
                user: {
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