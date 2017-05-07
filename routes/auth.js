/*jshint esversion: 6*/
const express = require('express');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const User = require('../models/user');
const authRoutes = express.Router();
const session = require('express-session');

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

authRoutes.post('/signup', (req, res, next) => {
  const firstNameInput = req.body.firstName;
  const lastNameInput = req.body.lastName;
  const emailInput = req.body.email;
  const passwordInput = req.body.password;

  if (emailInput === '' || passwordInput === '') {
    res.render('auth/signup', {
      errorMessage: 'Enter both email and password to sign up.'
    });
    return;
  }

  User.findOne({
    email: emailInput
  }, '_id', (err, existingUser) => {
    if (err) {
      next(err);
      return;
    }

    if (existingUser !== null) {
      res.render('auth/signup', {
        errorMessage: `The email ${emailInput} is already in use.`
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(passwordInput, salt);

    const userSubmission = {
      firstName: firstNameInput,
      lastName: lastNameInput,
      email: emailInput,
      password: hashedPass
    };

    const user = new User(userSubmission);

    user.save((err) => {
      if (err) {
        res.render('auth/signup', {
          errorMessage: 'Something went wrong. Try again later.'
        });
        return;
      }
      res.redirect('/login');
    });
  });
});

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login', {
    errorMessage: ''
  });
});

authRoutes.post('/login', (req, res, next) => {
  const emailInput = req.body.email;
  const passwordInput = req.body.password;

  if (emailInput === '' || passwordInput === '') {
    res.render('auth/login', {
      errorMessage: 'Enter both email and password to log in.'
    });
    return;
  }

  User.findOne({
    email: emailInput
  }, (err, user) => {
    if (err || user === null) {
      res.render('auth/login', {
        errorMessage: `There isn't an account with email ${emailInput}.`
      });
      return;
    }

    if (!bcrypt.compareSync(passwordInput, user.password)) {
      res.render('auth/login', {
        errorMessage: 'Invalid password.'
      });
      return;
    }

    req.session.currentUser = user;
    res.redirect('/');
  });
});

authRoutes.get('/logout', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect('/');
  });
});

module.exports = authRoutes;
