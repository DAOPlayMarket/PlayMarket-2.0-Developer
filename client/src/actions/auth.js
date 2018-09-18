export const authLogout = () => {
    return {
        type: 'AUTH_LOGOUT'
    }
};
export const authLogin = payload => {
    return {
        type: 'AUTH_LOGIN',
        keystore: payload.keystore,
        address: payload.address,
        name: payload.name,
        info: payload.info
    }
};

