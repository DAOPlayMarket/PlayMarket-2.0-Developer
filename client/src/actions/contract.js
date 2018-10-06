export const setContracts = payload => {
    return {
        type: 'SET_CONTRACTS',
        version: payload.version,
        PlayMarket: payload.PlayMarket,
        ICO: payload.ICO,
        ICOList: payload.ICOList,
        endTime: payload.endTime,
        number: payload.number
    }
};