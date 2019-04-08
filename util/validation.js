module.exports = {
    limit: () => {
        return (req, res, next) => {
          let { limit } = req.query;
          if (limit !== undefined && isNaN(parseFloat(limit * 1)))
              return res.status(400).json({error: 'Limit should be a valid number'});
          if (limit !== undefined && limit < 1)
              return res.status(400).json({error: 'Limit should be greater than 0'});
          //if no error
          next();
        }
    },

    offset: () => {
        return (req, res, next) => {
          let { offset } = req.query;
          if (offset !== undefined) {
            if (isNaN(parseFloat(offset * 1)))
              return res.status(400).json({error: 'Offset should be a valid number'});
            if (offset < 0)
              return res.status(400).json({error: 'Offset should be greater than or equal to 0'});
          }
          //if no error
          next();
        }
    },
  
    board: () => {
        return (req, res, next) => {
          if(req.params.board === undefined) 
            return res.status(400).json({error: 'Board is required'});
                                      
          if(req.params.board.trim() === '')
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
            let id;
            if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') //coming from form
                id  = req.body.thread_id;
            else       //coming from URL
                id = req.query.thread_id;

            if (id === undefined) // No Id
                return res.status(400).json({error: 'Thread Id missing'});  
            if (!id.match(/^[0-9a-fA-F]{24}$/))  // Not a valid ObjectId
                return res.status(400).json({error: 'Not a valid Thread Id'});  
            else    
                next();
        }
    },
  
    reply_id: () => {
        return (req, res, next) => {
            let id = req.body.reply_id;

            if (id === undefined) // No Id
                return res.status(400).json({error: 'Reply Id missing'});  
            if (!id.match(/^[0-9a-fA-F]{24}$/))  // Not a valid ObjectId
                return res.status(400).json({error: 'Not a valid Reply Id'});  
            else    
                next();
        }
    }
}