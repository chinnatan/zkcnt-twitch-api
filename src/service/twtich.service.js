const twitchAPI = require('./twitch.api.service')
const firestore = require('../utils/firestore.utils')
const DateTimeUtils = require('../utils/datetime.utils')
const StringUtils = require('../utils/string.utils')
const LogUtils = require('../utils/log.utils')
const DataNotFoundException = require('../exception/data.not.found.exception')
const moment = require('moment')

exports.followage = async (req, res) => {
    try {
        const channelId = req.params.channel
        const name = req.query.name
        const format = req.query.format

        if (StringUtils.isNullOrEmpty(channelId)) {
            throw new DataNotFoundException("channel id is null")
        } else if (StringUtils.isNullOrEmpty(name)) {
            throw new DataNotFoundException("name is null")
        } else if (StringUtils.isNullOrEmpty(format)) {
            throw new DataNotFoundException("format is null")
        }

        let token = await firestore.getAccessTokenById(channelId)
        let userId = await twitchAPI.getUserIdByName(token, name).then((res) => res.data.data[0].id)
        let followInfo = await twitchAPI.getFollowInfoByUserId(token, userId, channelId).then((res) => res.data.data)
        return res.status(200).json(DateTimeUtils.getDateByFormatFromNow(format, followInfo[0].followed_at))
    } catch (e) {
        LogUtils.error(e.message)
        return res.status(400).json(e.message)
    }
}