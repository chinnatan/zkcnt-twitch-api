const PassportRefresh = require('passport-oauth2-refresh')
const LogUtils = require('../utils/log.utils')
const FirestoreUtils = require('../utils/firestore.utils')
const moment = require('moment')

exports.refreshToken = async (id, refreshToken) => {
    try {
        return new Promise((resolve, reject) => {
            PassportRefresh.requestNewAccessToken('twtich', refreshToken,
                async function (err, newAccessToken, newRefreshToken) {
                    if (err) { reject(err) }
                    await FirestoreUtils.updateNewToken(id, newAccessToken, newRefreshToken)
                    return resolve(newAccessToken)
                })
        })
    } catch (e) {
        LogUtils.error(e.message)
    }
}

exports.isTodayTokenChecked = async (id) => {
    try {
        return new Promise(async (resolve, reject) => {
           await FirestoreUtils.updateIsTodayTokenChecked(id, moment().format("yyyyMMDD")).then(resolve()).catch(reject())
        })
    } catch (e) {
        LogUtils.error(e.message)
    }
}