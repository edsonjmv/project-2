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

const index = require('./routes/index');
const users = require('./routes/users');
const authRoutes = require('./routes/auth');
const interactRoutes = require('./routes/interact');
const tweetRoutes = require('./routes/tweeting');
const adminRoutes = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(passport.initialize());
app.use(passport.session());
app.use(expressLayouts);
app.locals.title = 'Project #2';

require('./config/authentication.js')(app);
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUserInfo = req.session.currentUser;
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/', authRoutes);
app.use('/', interactRoutes);
app.use('/', tweetRoutes);
app.use('/', adminRoutes);

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
