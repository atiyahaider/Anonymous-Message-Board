const getDb   = require('../util/db').getDb;
const Thread  = require('../models/thread');
const Reply   = require('../models/reply');
const bcrypt  = require('bcrypt');
const saltRounds = Number.parseInt(process.env.SALT_ROUNDS);

module.exports = {
    createReply: async (req, res, next) => {
        try {
            let reply = new Reply(req.body);
            reply.created_on = new Date();
            //encrypt password
            let hash = await bcrypt.hash(reply.delete_password, saltRounds)
            reply.delete_password = hash;
          
            let thread = await Thread.findByIdAndUpdate(req.body.thread_id , { $push: { replies: reply }, bumped_on: reply.created_on }, { new: true })          
            if (!thread)
              res.status(404).json({error: 'Thread Id ' + req.body.thread_id + ' does not exist'});
            else {
              let displayData = thread.toObject();
              delete displayData.__v;
              delete displayData.delete_password;
              displayData.replies.map((reply) => delete reply.delete_password);
              res.status(201).json(displayData);
            }
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

    reportReply: async (req, res, next) => {
        try {
            let { thread_id, reply_id } = req.body;
          
            let thread = await Thread.findOneAndUpdate({ _id: thread_id, 'replies._id': reply_id }, { 'replies.$.reported': true });
            if (!thread)
                res.status(404).json({error: 'Thread Id: ' + thread_id + ' and/or Reply Id: ' + reply_id + ' do not exist'});
            else
                res.status(201).json({success: reply_id + ' reported successfully'});
        } catch(err)  {
            next(err);
        }
    },

    getThreads: async (req, res, next) => {
        try {
            let filters = req.query;
            //remove any empty fields
            Object.keys(filters).forEach(key => {
                if (!filters[key])
                  delete filters[key];
            });
          
            // Add regex to text fields to do case insensitive search
            //  {'issue_text': { $regex : new RegExp(issue_text, "i") } }
            Object.keys(filters).forEach(key => {
                if (['issue_title', 'issue_text', 'created_by', 'status_text', 'assigned_to'].includes(key))
                  filters[key] = { '$regex': new RegExp(filters[key], "i") };
            });

            let data = await Thread.find(filters);
            res.status(200).json(data);
        } catch(err) {
            next(err);
        }
    },
  
    deleteReply: async (req, res, next) => {
        try {
            let { thread_id, reply_id } = req.body;
          
            //read hash from the db for this thread/reply
            let thread = await Thread.findOne({ _id: thread_id, 'replies._id': reply_id }).select( 'replies.$.delete_password' );
            if (!thread)
                res.status(404).json({error: 'Thread Id: ' + thread_id + ' and/or Reply Id: ' + reply_id + ' do not exist'});
            else {
                //compare the password to check if they match
                let isAuthorized = await bcrypt.compare(req.body.delete_password, thread.replies[0].delete_password )
                if (!isAuthorized) 
                    res.status(401).json({error: 'Incorrect password'});
                else
                {
                  await Thread.findOneAndUpdate({ _id: thread_id, 'replies._id': reply_id }, { 'replies.$.text': '[deleted]' });
                  res.status(201).json({success: 'Reply Id ' + reply_id + ' deleted successfully'});
                }
            }
        } catch(err) {
            next(err);
        }
    }
}