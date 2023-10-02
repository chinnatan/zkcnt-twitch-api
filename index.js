require('dotenv').config()
const path = require("path")
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const firestore = require("./src/utils/firestore.utils")
const AuthUtil = require('./src/utils/auth.utils')
const chalk = require('chalk')
const app = express();
const port = process.env.PORT
const SESSION_SECRET = process.env.SESSION_SECRET;

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({ secret: SESSION_SECRET }));
app.use(passport.initialize());

// Controller Configuration
const authenController = require("./src/controller/auth.controller");
app.use("/rest/auth", authenController);
const twtichController = require("./src/controller/twitch.controller");
app.use("/rest/twitch/:channel", twtichController);

// If user has an authenticated session, display it, otherwise display link to authenticate
app.get('/', function (req, res) {
    if (req.session && req.session.passport && req.session.passport.user) {
        return res.render("success", {
            profileImg: req.session.passport.user.data[0].profile_image_url,
            displayName: req.session.passport.user.data[0].display_name
        })
    }
    return res.render("index")
});

app.get('/success', async function (req, res) {
    await firestore.setUser(req.session.passport.user.data[0].id, req.session.passport.user)
    return res.render("success", {
        profileImg: req.session.passport.user.data[0].profile_image_url,
        displayName: req.session.passport.user.data[0].display_name
    })
});

app.listen(port, function () {
    console.info("Server is running port. ==>: " + chalk.blue(port));
});

function main () {
    AuthUtil.validToken()
    setInterval(() => {
        AuthUtil.validToken()
    }, 30 * 60 * 1000); // Every 30 Min. is Checked
}

main()