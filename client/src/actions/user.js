export const userLogout = () => {
    return {
        type: 'USER_LOGOUT'
    }
};
export const userLogin = payload => {
    return {
        type: 'USER_LOGIN',
        keystore: payload.keystore,
        address: payload.address,
        name: payload.name,
        info: payload.info
    }
};

export const userChangeInfo = payload => {
    return {
        type: 'USER_CHANGE_INFO',
        name: payload.name,
        info: payload.info
    }
};

