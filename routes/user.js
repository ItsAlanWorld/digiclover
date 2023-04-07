const express = require('express');

const router = express.Router();

const passport = require('passport');
const LineStrategy = require('passport-line').Strategy;

passport.use(new LineStrategy({
  channelID: '1655422536',
  channelSecret: '8d6dd008333242398b0101d43f6f9ddc',
  callbackURL: 'http://localhost:8080/user/line/callback',
},
((accessToken, refreshToken, profile, done) => {
  console.log(profile);
})));

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/join', (req, res, next) => {
  res.render('join');
});

router.get('/joinEmail', (req, res, next) => {
  res.render('joinEmail');
});

module.exports = router;
