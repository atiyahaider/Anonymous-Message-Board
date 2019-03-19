const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Thread = require('../models/thread');

// Schema for the db
const BoardSchema = new Schema({
  board: {type: String,
          required: true,
          unique: true},
  threads: Thread.schema
    //{ type: Schema.Types.ObjectId,
//      ref: 'thread' }
})

//* Model for the schema
const Board = mongoose.model('Board', BoardSchema)

// make this available to the users in our Node applications
module.exports = Board;