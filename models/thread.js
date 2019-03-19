const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Reply = require('../models/reply');

const ThreadSchema = new Schema({
  board:           {type: String, required: true},
  title:           {type: String, required: true},
  text:            {type: String, required: true},
  delete_password: {type: String, required: true},
  created_on:      {type: Date, required: true},
  bumped_on:       {type: Date, required: true},
  reported:        {type: Boolean, default: false},
  replies:         [Reply.schema],
});

//* Model for the schema
let Thread = mongoose.model('Thread', ThreadSchema);

// make this available to the users in our Node applications
module.exports = Thread;