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
        desc: payload.desc
    }
};

export const userChangeInfo = payload => {
    return {
        type: 'USER_CHANGE_INFO',
        name: payload.name,
        desc: payload.desc
    }
};

export const setUserPosition = payload => {
    return {
        type: 'SET_USER_POSITION',
        lat: payload.lat,
        long: payload.long
    }
};

