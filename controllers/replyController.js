const getDb   = require('../util/db').getDb;
const Thread  = require('../models/thread');
const Reply   = require('../models/reply');
const bcrypt  = require('bcrypt');
const saltRounds = Number.parseInt(process.env.SALT_ROUNDS);
const defaultLimit = Number.parseInt(process.env.DEFAULT_LIMIT) || 10;

module.exports = {
    getReplies: async (req, res, next) => {
        try {
            let data = await Thread.findById(req.query.thread_id);
          
            //sort the replies by descending date
            data.replies.sort((a, b) => b.bumped_on - a.bumped_on);

            res.status(200).json(removePasswordFromData(data));
        } catch(err) {
            next(err);
        }
    },

    createReply: async (req, res, next) => {
        try {
            let reply = new Reply(req.body);
            reply.created_on = new Date();
            reply.bumped_on = reply.created_on;
        
            //encrypt password
            let hash = await bcrypt.hash(reply.delete_password, saltRounds)
            reply.delete_password = hash;
          
            let thread = await Thread.findByIdAndUpdate(req.body.thread_id , { $push: { replies: reply }, bumped_on: reply.created_on }, { new: true })          
            if (!thread)
              res.status(404).json({error: 'Thread Id ' + req.body.thread_id + ' does not exist'});
            else 
              res.status(201).json(removePasswordFromData(thread));

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
                res.status(200).json({success: reply_id + ' reported successfully'});
        } catch(err)  {
            next(err);
        }
    },

    deleteReply: async (req, res, next) => {
        try {
            let { thread_id, reply_id } = req.body;
          
            //read hash from the db for this thread/reply
            let thread = await Thread.findOne({ _id: thread_id, 'replies._id': reply_id })
                                      .select('replies.$.delete_password');
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
                  res.status(200).json({success: 'Reply Id ' + reply_id + ' deleted successfully'});
                }
            }
        } catch(err) {
            next(err);
        }
    },
  
    updateReply: async (req, res, next) => {
        try {
            let { thread_id, reply_id } = req.body;

            let thread = await Thread.findOne({ _id: thread_id, 'replies._id': reply_id })
                                     .select('replies.$.text');
            if (!thread)
                res.status(404).json({error: 'Thread Id: ' + thread_id + ' and/or Reply Id: ' + reply_id + ' do not exist'});
            else {
                if (thread.replies[0].reported)
                    return res.status(403).json({error: 'This reply has been reported, and therefore cannot be edited'});
              
                if (thread.replies[0].text === '[deleted]') 
                    return res.status(403).json({error: 'This reply has been deleted, and therefore cannot be edited'});
              
                //compare the password to check if they match
                let isAuthorized = await bcrypt.compare(req.body.delete_password, thread.replies[0].delete_password )
                if (!isAuthorized) { console.log('auth');
                    res.status(401).json({error: 'Incorrect password'});}
                else
                {
                  await Thread.findOneAndUpdate({ _id: thread_id, 'replies._id': reply_id }, 
                                                { 'bumped_on': new Date(), 'replies.$.text': req.body.text, 'replies.$.bumped_on': new Date() });
                  res.status(200).json({success: 'Reply Id ' + reply_id + ' updated successfully'});
                }
            }
        } catch(err) {
          console.log(err);
            next(err);
        }
    }
}

function removePasswordFromData(data) {
  let displayData = data.toObject();
  delete displayData.__v;
  delete displayData.delete_password;
  displayData.replies.map((reply) => delete reply.delete_password);
  return displayData;
}