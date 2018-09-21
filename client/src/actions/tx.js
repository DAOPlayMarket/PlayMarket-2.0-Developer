export const setGasPrice = payload => {
    return {
        type: 'SET_GAS_PRICE',
        gasPrice: payload.gasPrice
    }
};

