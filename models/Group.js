/*jshint esversion: 6*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  contestId: {
    type: Schema.Types.ObjectId,
    ref: "Contest"
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
});

let Group = mongoose.model("Group", groupSchema);
module.exports = Group;
