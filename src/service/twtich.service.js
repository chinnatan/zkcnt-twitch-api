const twitchAPI = require('./twitch.api.service')
const FirestoreUtils = require('../utils/firestore.utils')
const DateTimeUtils = require('../utils/datetime.utils')
const StringUtils = require('../utils/string.utils')
const LogUtils = require('../utils/log.utils')
const DataNotFoundException = require('../exception/data.not.found.exception')
const APIException = require('../exception/api.exception')

exports.followage = async (req, res) => {
    const channelId = req.params.channel
    const name = req.query.name
    const format = req.query.format

    try {
        if (StringUtils.isNullOrEmpty(channelId)) {
            throw new DataNotFoundException("channel id is null")
        } else if (StringUtils.isNullOrEmpty(name)) {
            throw new DataNotFoundException("name is null")
        } else if (StringUtils.isNullOrEmpty(format)) {
            throw new DataNotFoundException("format is null")
        }

        let token = await FirestoreUtils.getAccessTokenById(channelId)
        let userId = await twitchAPI.getUserIdByName(token, name)
            .then((res) => res.data.data[0].id)
            .catch((err) => { throw new APIException(err.response.data.status, err.response.data.message) })
        let followInfo = await twitchAPI.getFollowInfoByUserId(token, userId, channelId)
            .then((res) => res.data.data)
            .catch((err) => { throw new APIException(err.response.data.status, err.response.data.message) })
        return res.status(200).send(DateTimeUtils.getDateByFormatFromNow(format, followInfo[0].followed_at))
    } catch (e) {
        LogUtils.error(e.message)
        if (e instanceof APIException) {
            return res.status(e.status).json(e.message)
        }
        return res.status(400).json(e.message)
    }
}