const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');
const replyController = require('../controllers/replyController');
const validate = require('../util/validation');

router.route('/boards')
    .get(threadController.getBoards)

router.route('/threads/:board')
//    .get(threadController.getThreads)
    .post(validate.board(), validate.title(), validate.text(), validate.password(), threadController.createThread)
    .put(validate.thread_id(), threadController.reportThread)
    .delete(validate.thread_id(), validate.password(), threadController.deleteThread);

router.route('/replies/:board')
    //.get(validate.id(), replyController.getReplies)
    .post(validate.thread_id(), validate.text(), validate.password(), replyController.createReply)
    .put(validate.thread_id(), validate.reply_id(), replyController.reportReply)
    .delete(validate.thread_id(), validate.reply_id(), replyController.deleteReply);

module.exports = router;