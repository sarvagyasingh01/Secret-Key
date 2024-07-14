const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Guser = require('../models/guserModel');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    Guser.findById(id)
        .then(user => {
            done(null, user);
        });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    const existingUser = await Guser.findOne({ googleId: profile.id });

    if (existingUser) {
        return done(null, existingUser);
    }

    const newUser = new Guser({
        googleUser: true,
        googleId: profile.id,
        username: profile.displayName,
        username: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        image: profile.photos[0].value
    });

    await newUser.save();
    done(null, newUser);
}));
