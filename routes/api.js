const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');
const replyController = require('../controllers/replyController');
const validate = require('../util/validation');

router.route('/boards')
    .get(validate.offset(), validate.limit(), threadController.getBoards)

router.route('/threads/:board')
    .get(validate.board(), validate.offset(), validate.limit(), threadController.getThreads)
    .post(validate.board(), validate.title(), validate.text(), validate.password(), threadController.createThread)
    .put(validate.thread_id(), threadController.reportThread)
    .delete(validate.thread_id(), validate.password(), threadController.deleteThread);

router.route('/threads/edit/:board')
    .put(validate.thread_id(), threadController.updateThread);

router.route('/replies/:board')
    .get(validate.thread_id(), replyController.getReplies)
    .post(validate.thread_id(), validate.text(), validate.password(), replyController.createReply)
    .put(validate.thread_id(), validate.reply_id(), replyController.reportReply)
    .delete(validate.thread_id(), validate.reply_id(), replyController.deleteReply);

router.route('/replies/edit/:board')
    .put(validate.thread_id(), validate.reply_id(), replyController.updateReply);

module.exports = router;