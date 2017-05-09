/*jshint esversion: 6*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  creator:{
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  content: String,
  picPath: String,
  favorites: Number,
  retweets: Number
});


tweetSchema.set('timestamps', true);

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
