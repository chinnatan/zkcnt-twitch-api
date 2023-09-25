const { async } = require('@firebase/util')
const axios = require('axios')

function getOptions(token) {
    return options = {
        baseURL: process.env.BASE_URL_TWTICH_API,
        withCredentials: true,
        headers: {
            "Authorization": 'Bearer ' + token,
            "Client-Id": process.env.TWITCH_CLIENT_ID,
            "Content-Type": "application/json",
        },
    }
}


exports.getUserIdByName = async (token, name) => {
    return axios.get('/users?login=' + name, getOptions(token))
}

exports.getFollowInfoByUserId = async (token, userId, channelId) => {
    return axios.get('/channels/followers?user_id=' + userId + '&broadcaster_id=' + channelId, getOptions(token))
}