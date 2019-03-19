module.exports = {
    board: () => {
        return (req, res, next) => {
          if(req.body.board === undefined)
            return res.status(400).json({error: 'Board is required'});

          if(req.body.board.trim() === '')
            return res.status(400).json({error: 'Board is required'});
          //if no error
          next();
        }
    },

    title: () => {
        return (req, res, next) => {
          if(req.body.title === undefined)
            return res.status(400).json({error: 'Title is required'});

          if(req.body.title.trim() === '')
            return res.status(400).json({error: 'Title is required'});
          //if no error
          next();
        }
    },

    text: () => {
        return (req, res, next) => {
          if(req.body.text === undefined)
            return res.status(400).json({error: 'Text is required'});

          if(req.body.text.trim() === '')
            return res.status(400).json({error: 'Text is required'});
          //if no error
          next();
        }
    },

    password: () => {
        return (req, res, next) => {
          if(req.body.delete_password === undefined)
            return res.status(400).json({error: 'Password to delete is required'});

          if(req.body.delete_password.trim() === '')
            return res.status(400).json({error: 'Password to delete is required'});
          //if no error
          next();
        }
    },

    thread_id: () => {
        return (req, res, next) => {
            let id = req.body.thread_id;

            if (id === undefined) // No Id
                return res.status(400).json({error: 'Id missing'});  
            if (!id.match(/^[0-9a-fA-F]{24}$/))  // Not a valid ObjectId
                return res.status(400).json({error: 'Not a valid Id'});  
            else    
                next();
        }
    },
  
    reply_id: () => {
        return (req, res, next) => {
            let id = req.body.reply_id;

            if (id === undefined) // No Id
                return res.status(400).json({error: 'Id missing'});  
            if (!id.match(/^[0-9a-fA-F]{24}$/))  // Not a valid ObjectId
                return res.status(400).json({error: 'Not a valid Id'});  
            else    
                next();
        }
    },

    comment: () => {
        return (req, res, next) => {
          if(req.body.comment !== undefined && req.body.comment.trim() === '')
            return res.status(400).json({error: 'Comment cannot be empty'});
          //if no error
          next();
        }
    },
}