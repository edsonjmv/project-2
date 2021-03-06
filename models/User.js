/*jshint esversion: 6*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String
});

userSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);

module.exports = User;
