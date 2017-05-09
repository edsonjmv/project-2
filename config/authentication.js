/* jshint esversion:6 */
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User.js');
<<<<<<< HEAD
<<<<<<< HEAD

module.exports = app => {
    app.use(session({
        secret: 'project-2',
=======
const Contest = require('../models/Contest.js');

module.exports = app => {
    app.use(session({
        secret: 'ironfundingdev',
>>>>>>> ba79cca7234a71ed8eccd93baa21997ba663dab0
=======

const Contest = require('../models/Contest.js');

module.exports = app => {
    app.use(session({
        secret: 'ironfundingdev',
>>>>>>> 932c09b00680875b3ab8e14cf17f8b3d47680480
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    }));

    // NEW
    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser((id, cb) => {
        User.findById(id, (err, user) => {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        });
    });

    // Signing Up
    passport.use('local-signup', new LocalStrategy({
            passReqToCallback: true
        },
        (req, username, password, next) => {
            // To avoid race conditions
            process.nextTick(() => {
                User.findOne({
                    'username': username
                }, (err, user) => {
                    if (err) {
                        return next(err);
                    }

                    if (user) {
                        return next(null, false);
                    } else {
                        // Destructure the body
                        const { username, email, description, password } = req.body;
                        const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                        const newUser = new User({
                            username,
                            email,
                            description,
                            password: hashPass
                        });

                        newUser.save((err) => {
                            if (err) {
                                next(err);
                            }
                            return next(null, newUser);
                        });
                    }
                });
            });
        }));

passport.use('local-login', new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

    app.use(passport.initialize());
    app.use(passport.session());
};
