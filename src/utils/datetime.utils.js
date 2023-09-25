const moment = require("moment")
const LogUtils = require('../utils/log.utils')

exports.getDateByFormatFromNow = (format, date) => {
    try {
        let m = moment(date)
        let currDate = moment()
        let days = Math.round(moment.duration(currDate.diff(m)).days());
        let months = Math.round(moment.duration(currDate.diff(m)).months());
        let weekdays = Math.round(moment.duration(currDate.diff(m)).weeks());
        let years = Math.round(moment.duration(currDate.diff(m)).years());
        let hours = Math.round(moment.duration(currDate.diff(m)).hours());
        let minute = Math.round(moment.duration(currDate.diff(m)).minutes());
        let sec = Math.round(moment.duration(currDate.diff(m)).seconds());
        switch (format) {
            case 'ymd':
                return years + ' ปี ' + months + ' เดือน ' + days + ' วัน';
            case 'ymwd':
                return years + ' ปี ' + months + ' เดือน ' + weekdays + ' สัปดาห์ ' + days + ' วัน';
            case 'ymwdhis':
                return years + ' ปี ' + months + ' เดือน ' + weekdays + ' สัปดาห์ ' + days + ' วัน ' + hours + ' ชั่วโมง ' + minute + ' นาที ' + sec + ' วินาที';
            default:
                return years + ' ปี ' + months + ' เดือน ' + weekdays + ' สัปดาห์ ' + days + ' วัน ' + hours + ' ชั่วโมง ' + minute + ' นาที ' + sec + ' วินาที';
        }
    } catch (e) {
        LogUtils.error(e.message)
    }
}