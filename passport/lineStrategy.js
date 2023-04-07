const passport = require('passport');
const LineStrategy = require('passport-line').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(new LineStrategy({
    channelID: process.env.LINE_ID,
    channelSecret: process.env.LINE_SECRET,
    callbackURL: 'http://localhost:8080/auth/line/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('line profile', profile);
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'line' },
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create({
          email: profile._json && profile._json.line_account_email,
          name: profile.displayName,
          snsId: profile.id,
          provider: 'line',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
