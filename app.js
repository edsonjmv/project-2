/*jshint esversion: 6*/
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
mongoose.connect('mongodb://localhost/project2');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('./models/User.js');

const index = require('./routes/index');
const authRoutes = require('./routes/auth');
const interactRoutes = require('./routes/interact');
const tweetRoutes = require('./routes/tweeting');
const adminRoutes = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);
app.locals.title = 'Project #2';


app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use(session({
    secret: 'ironfundingdev',
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
                    const { username, email, lastName, password } = req.body;
                    const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                    const newUser = new User({
                        firstName : username,
                        email,
                        lastName,
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

    app.use(passport.initialize());
    app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', authRoutes);
app.use('/', interactRoutes);
app.use('/', tweetRoutes);
app.use('/', adminRoutes);


// app.use((req, res, next) => {
//   if (req.session.currentUser) {
//     res.locals.currentUserInfo = req.session.currentUser;
//     res.locals.isUserLoggedIn = true;
//   } else {
//     res.locals.isUserLoggedIn = false;
//   }
//   next();
// });



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
