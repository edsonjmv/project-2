/*jshint esversion: 6*/
const express = require('express');
const mongoose = require('mongoose');
const Contest = require('../models/Contest');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

module.exports = router;
