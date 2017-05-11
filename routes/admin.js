/*jshint esversion: 6*/
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const User = require('../models/User');
const Contest = require('../models/Contest');
const upload = multer({ dest: './public/uploads/' });
const mongoose = require('mongoose');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');

const authorizeContest = require('../middleware/contest-authorization');

const adminRoutes = express.Router();

adminRoutes.get('/new-contests', ensureLoggedIn(), function(req, res, next) {
  res.render('new-contests');
});

adminRoutes.post('/new-contests', upload.single('photo'), (req, res, next) => {
  const nameInput = req.body.name;
  const hashtagInput = req.body.hashtag;
  const dateInput = req.body.finalDate;
  const picInput = `/uploads/${req.file.filename}`;
  const prizeInput = req.body.prize;
  console.log('log');
  const contestSubmission = {
    name: nameInput,
    hashtag: hashtagInput,
    finalDate: dateInput,
    picPath: picInput,
    prize: prizeInput
  };

  const contest = new Contest(contestSubmission);

  contest.save((err) => {

    if (err) {
      res.render('/', {
        errorMessage: 'Something went wrong. Try again later.'
      });
      return;
    }
    res.redirect('/interact/dashboard');
  });
});


adminRoutes.post('/:id/delete', (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Contest.findByIdAndRemove(id, (err, contest) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/interact/dashboard');
  });
});


module.exports = adminRoutes;
