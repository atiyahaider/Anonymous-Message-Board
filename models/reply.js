const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ReplySchema = new Schema({
  text:            {type: String, required: true},
  delete_password: {type: String, required: true},
  created_on:      {type: Date, required: true},
  bumped_on:       {type: Date, required: true},
  reported:        {type: Boolean, default: false}
});

//* Model for the schema
let Reply = mongoose.model('Reply', ReplySchema);

// make this available to the users in our Node applications
module.exports = Reply;