const PassportRefresh = require('passport-oauth2-refresh')
const LogUtils = require('../utils/log.utils')
const FirestoreUtils = require('../utils/firestore.utils')
const TwitchAPI = require('../service/twitch.api.service')

exports.refreshToken = async (id, refreshToken) => {
    try {
        return new Promise((resolve, reject) => {
            PassportRefresh.requestNewAccessToken('twtich', refreshToken,
                async function (err, newAccessToken, newRefreshToken) {
                    if (err) { throw err }
                    await FirestoreUtils.updateNewToken(id, newAccessToken, newRefreshToken)
                })
        })
    } catch (e) {
        LogUtils.error(e.message)
    }
}

exports.validToken = async () => {
    LogUtils.info("=== Run validToken === ")
    try {
        let channels = await FirestoreUtils.getAllChannels()
        for (let channel of channels) {
            let token = await FirestoreUtils.getAccessTokenById(channel.id)
            let channelRefreshToken = await FirestoreUtils.getRefreshAccessTokenById(channel.id)
            await TwitchAPI.validToken(token).catch(async () => {
                await this.refreshToken(channel.id, channelRefreshToken)
            })
        }
    } catch (e) {
        LogUtils.error(e.message)
    }
}