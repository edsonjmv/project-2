/*jshint esversion: 6*/
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const User = require('../models/User');
const upload = multer({ dest: './public/uploads/' });
const mongoose = require('mongoose');
const Contest = require('../models/Contest');
const Group = require('../models/Group');
const Twitter = require('twitter');
const ensureLogin = require("connect-ensure-login");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
require("dotenv").config();
const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const TWITTER_ACCESS_TOKEN_KEY = process.env.TWITTER_ACCESS_TOKEN_KEY;
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;
const interactRoutes = express.Router();
const client = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

interactRoutes.get('/profile', ensureLoggedIn('/login'), function(req, res, next) {
  res.render('interact/profile', {
    user: req.user
  });
});

// interactRoutes.post('/upload', upload.single('photo'), function(req, res){
//
//   pic = new Picture({
//     name: req.body.name,
//     pic_path: `/uploads/${req.file.filename}`,
//     pic_name: req.file.originalname
//   });
//
//   pic.save((err) => {
//       res.redirect('/dashboard');
//   });
// });
//
interactRoutes.get('/dashboard', function(req, res, next) {
  // Picture.find((err, pictures) => {
  Contest.find((err, contests) => {
    res.render('interact/dashboard', {
      contests
    });
  }); // });
});

interactRoutes.get('/participate/:id', (req,res, next)=>{
  var contest = req.params.id;
  var user = req.session.passport.user;
  let group = {
    contestId : contest,
    userId : user
  };
  const groups = new Group(group);
  groups.save((err) => {
    if (err) {
      res.render('/', {
        errorMessage: 'Something went wrong. Try again later.'
      });
      return;
    }
    res.redirect('/interact/'+ contest);
  });
});

interactRoutes.get('/:id', (req, res, next) => {
  Contest.findById(req.params.id).populate('_creator').exec( (err, contest) => {
    if (err){ return next(err); }
    let hash = '#' + contest.hashtag;
      client.get('https://api.twitter.com/1.1/search/tweets.json', {q: hash, result_type: 'mixed', count: 100}, function(error, tweets, response) {
        var text = "";
        var newArray =[];
        tweets.statuses.sort(function(a,b){
          return parseFloat(b.favorite_count) - parseFloat(a.favorite_count);
        });
        Group.find({contestId : contest._id})
        .populate('userId')
        .populate('contestId')
        .then(groups => {
          let users = groups.map(g => g.userId);
          res.render('show', {contest:contest, associatedUsers:users, tweets:tweets});
        })
        .catch(err => console.log(error));
      });
    });
  });

module.exports = interactRoutes;
