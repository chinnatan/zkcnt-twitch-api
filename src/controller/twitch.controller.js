const express = require("express");
const router = express.Router();
const twitchService = require("../service/twtich.service")

var bodyParser = require("body-parser");

// parse application/json
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/:channel/followage", twitchService.followage);

module.exports = router;