const FirestoreUtils = require('../utils/firestore.utils')
const AuthUtils = require('../utils/auth.utils')
const TwitchAPI = require('../service/twitch.api.service')

const verifyToken = async (req, res, next) => {
    const channelId = req.params.channel
    let token = await FirestoreUtils.getAccessTokenById(channelId)
    let refreshToken = await FirestoreUtils.getRefreshAccessTokenById(channelId)
    await TwitchAPI.validToken(token).then((res) => {
        return next()
    }).catch(() => {
        AuthUtils.refreshToken(channelId, refreshToken).then(() => {
            return next()
        })
    })
};

module.exports = verifyToken;