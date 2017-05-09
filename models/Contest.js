/*jshint esversion: 6*/
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const contestSchema = new Schema({
  name: String,
  hashtag: String,
  finalDate: String,
  picPath: String,
  prize: String,
  creator:{
    type: Schema.Types.ObjectId,
    ref:"User"
   }
  },
  {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

let Contest = mongoose.model("Contest", contestSchema);
module.exports = Contest;
