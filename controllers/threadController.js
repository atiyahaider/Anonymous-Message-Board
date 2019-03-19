const getDb   = require('../util/db').getDb;
const Thread  = require('../models/thread');
const Reply   = require('../models/reply');
const bcrypt  = require('bcrypt');
const saltRounds = Number.parseInt(process.env.SALT_ROUNDS);

module.exports = {
    createThread: async (req, res, next) => {
        try {
            let board = req.params.board.trim();
            let thread = new Thread(req.body);
            thread.board = board;
            thread.created_on = new Date();
            thread.bumped_on = thread.created_on;

            //encrypt password
            let hash = await bcrypt.hash(thread.delete_password, saltRounds)
            thread.delete_password = hash;
          
            //check if board already exists
            /*let exists = await Thread.findOne({'board': { $regex : new RegExp('^' + board + '$', "i") } });
            //if (exists) {  //add thread to the current board
              let data = await Board.findByIdAndUpdate(exists._id , { $push: { threads: thread } }, { new: true })
              res.status(200).json(data);
            }*/
//            else { //create a new board and thread
                await thread.save();
                res.status(201).json({board: board, _id: thread._id, title: thread.title, text: thread.text, created_on: thread.created_on});
//            }
        } catch(err)  {
            next(err);
        }
    },

    getThread: async (req, res, next) => {
        try {
            let data = await Thread.findById(req.body._id);
            res.status(200).json(data);
        } catch(err)  {
            next(err);
        }
    },

    reportThread: async (req, res, next) => {
        try {
            let { thread_id } = req.body;
          
            //read hash from the db for this thread
            let thread = await Thread.findByIdAndUpdate(thread_id, {reported: true});
            if (!thread)
                res.status(404).json({error: 'Thread Id ' + thread_id + ' does not exist'});
            else
                res.status(201).json({success: thread_id + ' reported successfully'});
        } catch(err)  {
            next(err);
        }
    },

    getBoards: async (req, res, next) => {
        try {
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
                             .sort('board');         
            res.status(200).json(data);
        } catch(err) {
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
                  res.status(201).json({success: 'Thread Id ' + thread_id + ' deleted successfully'});
                }
            }
        } catch(err) {
            next(err);
        }
    }
}