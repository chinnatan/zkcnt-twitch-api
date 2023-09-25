# zkcnt-twitch-api
Custom Commands for Twitch
## /rest/twitch/:channel-id/followage?name=:user&?format=ymd
ตรวจสอบว่าผู้ใช้ติดตามช่องมานานแค่ไหน
- :channel-id - The channel id
- :user - The name of the user
- format
  1. ymd คือ "0 ปี 0 เดือน 0 วัน"
  2. ymwd คือ "0 ปี 0 เดือน 0 วีค 0 วัน"
  3. ymwdhis คือ "0 ปี 0 เดือน 0 วีค 0 วัน 0 ชั่วโมง 0 นาที 0 วินาที"
