const express = require("express");
const router = express.Router();
const passport = require("passport");
const request = require('request');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

var bodyParser = require("body-parser");

// parse application/json
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_SECRET = process.env.TWITCH_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = function (accessToken, done) {
    var options = {
        url: 'https://api.twitch.tv/helix/users',
        method: 'GET',
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Authorization': 'Bearer ' + accessToken
        }
    };

    request(options, function (error, response, body) {
        if (response && response.statusCode == 200) {
            done(null, JSON.parse(body));
        } else {
            done(JSON.parse(body));
        }
    });
}

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use('twitch', new OAuth2Strategy({
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_SECRET,
    callbackURL: CALLBACK_URL,
    state: true
},
    function (accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;

        // User.findOrCreate({ twitchId: profile.id }, function (err, user) {
        //     done(err, user);
        // });

        // Securely store user profile in your DB
        //User.findOrCreate(..., function(err, user) {
        //  done(err, user);
        //});

        done(null, profile);
    }
));

// Set route to start OAuth link, this is where you define scopes to request
router.get("/", passport.authenticate('twitch', { scope: ['user_read', 'user:read:follows', 'moderation:read', 'moderator:read:followers'] }));
// Set route for OAuth redirect
router.get('/callback', passport.authenticate('twitch', { successRedirect: '/success', failureRedirect: '/' }));

module.exports = router;