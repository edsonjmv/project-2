/*jshint esversion: 6*/
const express = require('express');
const session = require('express-session');
const multer  = require('multer');
const User = require('../models/User');
const upload = multer({ dest: './public/uploads/' });
const mongoose = require('mongoose');


const interactRoutes = express.Router();

interactRoutes.get('/profile', function(req, res, next) {
  res.render('interact/profile');
});

interactRoutes.post('/upload', upload.single('photo'), function(req, res){

  pic = new Picture({
    name: req.body.name,
    pic_path: `/uploads/${req.file.filename}`,
    pic_name: req.file.originalname
  });

  pic.save((err) => {
      res.redirect('/dashboard');
  });
});

interactRoutes.get('/dashboard', function(req, res, next) {
  Picture.find((err, pictures) => {
    res.render('interact/dashboard', {pictures});
  });
});


module.exports = interactRoutes;
