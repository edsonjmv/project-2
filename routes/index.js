var express = require('express');
var mongoose = require('mongoose');
var Contest = require('../models/Contest');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Contest.find({},(err, contests) => {
  // if(err){
  //   return error;
  // }
  res.render('index', {user: req.user});
  // })
});

module.exports = router;
