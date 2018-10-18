export const setNodes = payload => {
    return {
        type: 'SET_NODES',
        nodes: payload.nodes
    }
};

export const setNode = payload => {
    return {
        type: 'SET_NODE',
        domain: payload.domain,
        url: 'https://' + payload.domain,
        lat: payload.lat,
        long: payload.long,
        ip: payload.ip
    }
};