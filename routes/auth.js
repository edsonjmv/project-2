/*jshint esversion: 6*/
// routes/auth-routes.js
const express    = require("express");
const authRoutes = express.Router();

// User model
const User       = require("../models/User");
const passport = require("passport");
// Bcrypt to encrypt passwords
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const session = require('express-session');
const mongoose = require('mongoose');


const authorizeContest = require('../middleware/contest-authorization');


authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/login", ensureLoggedOut(), (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", ensureLoggedOut(), passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get('/auth/twitter', passport.authenticate('twitter'));

authRoutes.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

authRoutes.get("interact/profile", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("profile", { user: req.user });
});

authRoutes.get("/logout", ensureLoggedIn('auth/login'), (req, res) => {
  req.logout();
  res.redirect("/login");

});

module.exports = authRoutes;
