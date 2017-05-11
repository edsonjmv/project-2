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
const bcrypt = require("bcrypt");
const passport = require("passport"),TwitterStrategy = require('passport-twitter').Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User.js");
const flash = require("connect-flash");

mongoose.connect('mongodb://localhost/project2');

const index = require('./routes/index');
const users = require('./routes/users');
const authRoutes = require('./routes/auth');
const interactRoutes = require('./routes/interact');
const adminRoutes = require('./routes/admin');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(passport.initialize());
app.use(passport.session());
app.use(expressLayouts);
app.locals.title = 'Project #2';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({
  secret: 'Project #2',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new TwitterStrategy({
    consumerKey: 'LGk2jjD858slF56Jds2k3Mjzv',
    consumerSecret: 'rAC0UaqZDMbxYUvvVFNvzppxJrvdx5TqvIIKgMvxTPdStT9AKq',
    callbackURL: "http://localhost:3000"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({
      username: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  }
));

app.use((req, res, next) => {

    if (typeof(req.user) !== "undefined") {
        res.locals.userSignedIn = true;
    } else {
        res.locals.userSignedIn = false;
    }
    next();
});

app.use('/admin', adminRoutes);
app.use('/', index);
app.use('/users', users);
app.use('/', authRoutes);
app.use('/interact', interactRoutes);


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
