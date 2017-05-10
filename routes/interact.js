/*jshint esversion: 6*/
const express = require('express');
const session = require('express-session');
const multer  = require('multer');
const User = require('../models/User');
const upload = multer({ dest: './public/uploads/' });
const mongoose = require('mongoose');
const Contest = require('../models/Contest');
const Twitter = require('twitter');
require("dotenv").config();
const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const TWITTER_ACCESS_TOKEN_KEY = process.env.TWITTER_ACCESS_TOKEN_KEY;
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;

const client = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});



const interactRoutes = express.Router();

interactRoutes.get('/profile', function(req, res, next) {
  res.render('interact/profile', { user: req.user });
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
    res.render('interact/dashboard', {contests});
  });  // });
});


interactRoutes.get('/:id', (req, res, next) => {
  Contest.findById(req.params.id).populate('_creator').exec( (err, contest) => {
    if (err){ return next(err); }
    console.log("show contest");
    console.log(contest);

    let hash = contest.hashtag;
      client.get('https://api.twitter.com/1.1/search/tweets.json', {q: hash, result_type: 'mixed', count: 100}, function(error, tweets, response) {
        res.render('show', {contest, tweets});
      });
  });
});

module.exports = interactRoutes;
