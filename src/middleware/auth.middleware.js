const FirestoreUtils = require('../utils/firestore.utils')
const AuthUtils = require('../utils/auth.utils')
const TwitchAPI = require('../service/twitch.api.service')
const moment = require('moment')

const verifyToken = async (req, res, next) => {
    console.time()
    const channelId = req.params.channel
    let token = await FirestoreUtils.getAccessTokenById(channelId)
    let refreshToken = await FirestoreUtils.getRefreshAccessTokenById(channelId)
    let isTodayTokenChecked = await FirestoreUtils.getIsTodayTokenChecked(channelId)
    if(isTodayTokenChecked === moment().format("yyyyMMDD") && (isTodayTokenChecked != null || isTodayTokenChecked != undefined)) {
        return next()
    }
    await TwitchAPI.validToken(token).then(async () => {
        await AuthUtils.isTodayTokenChecked(channelId)
        return next()
    }).catch(() => {
        AuthUtils.refreshToken(channelId, refreshToken).then(async () => {
            await AuthUtils.isTodayTokenChecked(id)
            return next()
        })
    })
};

module.exports = verifyToken;