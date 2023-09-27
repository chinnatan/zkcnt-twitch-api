const express = require("express");
const router = express.Router({mergeParams: true});
const twitchService = require("../service/twtich.service")

var bodyParser = require("body-parser");

// parse application/json
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/followage", twitchService.followage);

module.exports = router;