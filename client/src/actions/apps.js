import axios from 'axios';

const receivePosts = (json) => {
    return {
        type: 'RECEIVE_POSTS',
        apps: json
    }
};
const receiveApps = (json) => {
    return {
        type: 'RECEIVE_POSTS',
        apps: json
    }
};

export function fetchPosts() {
    return async function (dispatch) {
        let options = {
            method: 'get',
            url: 'https://jsonplaceholder.typicode.com/posts'
        };
        let json = (await axios(options)).data;
        dispatch(receivePosts(json));
    }
}
export function fetchApps(address) {
    return async function (dispatch) {
        let options = {
            method: 'post',
            url: 'https://n000002.playmarket.io:3000/api/get-apps-by-developer',
            data: {
                address: address
            }
        };
        let response = (await axios(options)).data;
        dispatch(receiveApps(response.result));
    }
}