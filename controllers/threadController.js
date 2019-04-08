const getDb   = require('../util/db').getDb;
const Thread  = require('../models/thread');
const Reply   = require('../models/reply');
const bcrypt  = require('bcrypt');
const saltRounds = Number.parseInt(process.env.SALT_ROUNDS) || 12;
const defaultLimit = Number.parseInt(process.env.DEFAULT_LIMIT) || 10;

module.exports = {
    getBoards: async (req, res, next) => {
        try {
         
          //find the total number of distinct boards
          let distinct = await Thread.distinct('board');
          let total = distinct.length;

          let offset = req.query.offset ? parseInt(req.query.offset) : 0;
          let limit = req.query.limit ? parseInt(req.query.limit) : defaultLimit;

          //get a page of boards
          let data = await Thread.aggregate(
                              [
                                {
                                  $group: {
                                    _id: "$board",
                                    threads: { $sum: 1 },
                                    replies: { $sum: { $size: "$replies" } },
                                    bumped_on: { $max: "$bumped_on" }
                                  }
                                }
                              ]
                             )
                             .collation({locale:'en', strength: 2}) //for proper alphabetical sorting
                             .sort('_id')
                             .skip(offset)
                             .limit(limit);         
            res.status(200).json({total: total, data: data});
        } catch(err) {
            next(err);
        }
    },
  
    getThreads: async (req, res, next) => {
        try {
          //find the total number of threads for this board
          let total = await Thread.countDocuments({'board': req.params.board.trim()});

          let offset = req.query.offset ? parseInt(req.query.offset) : 0;
          let limit = req.query.limit ? parseInt(req.query.limit) : defaultLimit;
          
          let data = await Thread.aggregate()
                              .match({board: req.params.board.trim()})
                              .sort('-bumped_on')
                              .skip(offset)
                              .limit(limit)
                              .project({
                                  _id: 1,
                                  title: 1,
                                  text: 1,
                                  bumped_on: 1,
                                  reported: 1,
                                  reply_count: {$size: '$replies'},
                                  replies: {
                                      '$map': { 
                                          'input': '$replies', 
                                          'as': 'reply', 
                                          'in': { 
                                              '_id': '$$reply._id',
                                              'text': '$$reply.text', 
                                              'bumped_on': '$$reply.bumped_on'
                                          }
                                      },
                                  }                              
                              })

            //sort the replies by descending date && slice top 3
            data.map(obj => {
                obj.replies = obj.replies.sort((a, b) => b.bumped_on - a.bumped_on).slice(0,3);
            });

            res.status(200).json({total: total, data: data});
        } catch(err) {
            next(err);
        }
    },

    createThread: async (req, res, next) => {
        try {
            let board = req.params.board.trim();

            //check if board already exists, if adding a new board
            if (req.body.newBoard) {
                let exists = await Thread.findOne({'board': { $regex : new RegExp('^' + board + '$', "i") } });
                if (exists) 
                    return res.status(409).json({error: 'Duplicate Board, this board already exists. Please add threads to the existing board or create a new one.'});
            }
 
            //create a new thread
            let thread = new Thread(req.body);
            thread.board = board;
            thread.created_on = new Date();
            thread.bumped_on = thread.created_on;

            //encrypt password
            let hash = await bcrypt.hash(thread.delete_password, saltRounds)
            thread.delete_password = hash;

            await thread.save();
            res.status(201).json({board: board, _id: thread._id, title: thread.title, text: thread.text, created_on: thread.created_on});
        } catch(err)  {
            next(err);
        }
    },

    reportThread: async (req, res, next) => {
        try {
            let { thread_id } = req.body;

            let thread = await Thread.findByIdAndUpdate(thread_id, {reported: true});
            if (!thread)
                res.status(404).json({error: 'Thread Id ' + thread_id + ' does not exist'});
            else
                res.status(200).json({success: thread_id + ' reported successfully'});
        } catch(err)  {
            next(err);
        }
    },
  
    deleteThread: async (req, res, next) => {
        try {
            let { thread_id } = req.body;
          
            //read hash from the db for this thread
            let thread = await Thread.findById(thread_id).select('delete_password');
          
            if (!thread)
                res.status(404).json({error: 'Thread Id ' + thread_id + ' does not exist'});
            else {
                //compare the password to check if they match
                let isAuthorized = await bcrypt.compare(req.body.delete_password, thread.delete_password )
                if (!isAuthorized) 
                    res.status(401).json({error: 'Incorrect password'});
                else
                {
                  await Thread.findByIdAndDelete(thread_id);
                  res.status(200).json({success: 'Thread Id ' + thread_id + ' deleted successfully'});
                }
            }
        } catch(err) {
            next(err);
        }
    },
  
    updateThread: async (req, res, next) => {
        try {
            let { thread_id } = req.body;
          
            //read hash from the db for this thread
            let thread = await Thread.findById(thread_id).select('delete_password reported');
            if (!thread)
                res.status(404).json({error: 'Thread Id ' + thread_id + ' does not exist'});
            else {
                if (thread.reported)
                    return res.status(403).json({error: 'This thread has been reported, and therefore cannot be edited'});
              
                //compare the password to check if they match
                let isAuthorized = await bcrypt.compare(req.body.delete_password, thread.delete_password )
                if (!isAuthorized) 
                    res.status(401).json({error: 'Incorrect password'});
                else
                {
                  await Thread.findByIdAndUpdate(thread_id, {'title': req.body.title, 'text': req.body.text, 'bumped_on': new Date()});
                  res.status(200).json({success: 'Thread Id ' + thread_id + ' updated successfully'});
                }
            }
        } catch(err)  {
            next(err);
        }
    },
}