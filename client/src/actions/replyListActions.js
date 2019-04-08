import { REPLIES_LOADING, GET_THREAD, GET_REPLIES, REPLIES_ERROR, REPORT_REPLY, DELETE_REPLY } from './actionTypes';
import handleHTTPErrors from './errorHandler';

import { setPathname, setTotal } from './paginationActions';
import { REPLIES_LIST } from '../reducers/listTypes';

import { setModalError, setModalLoading } from './modalActions';

export const setRepliesLoading = () => {
  return {
    type: REPLIES_LOADING
  }
};

export const getReplies = (thread, offset, limit) => {
  let replies = [...thread.replies]
  let repliesSliced = replies.splice(offset, limit)
  return {
    type: GET_REPLIES,
    replies: repliesSliced
  }
};

export const getReplyList = (pathname) => (dispatch, getState) => {
  
  dispatch(setRepliesLoading());

  let pagination = getState().pagination.replies;
  if ((pagination.pathname.path !== pathname.path) || 
      (pagination.pathname.params.board !== pathname.params.board) || 
      (pagination.pathname.params.threadId !== pathname.params.threadId)) {
    dispatch(setPathname(REPLIES_LIST, pathname.path, pathname.params.board, pathname.params.threadId));
    pagination = getState().pagination.replies;
  }
  
  //make async call
  return fetch('/api/replies/' + pagination.pathname.params.board + '?thread_id=' + pagination.pathname.params.threadId)
        .then(handleErrors,     //http & validation errors
              error => {throw Error(error.error)}    //any other server error
             )

        .then(results => {
          return results.json();
        }).then(data => {
                dispatch(setTotal(REPLIES_LIST, data.replies.length));
                dispatch ({
                  type: GET_THREAD,
                  payload: data
                })
                dispatch(getReplies(data, pagination.offset, pagination.limit));
          })
          .catch(err => {
              dispatch ({
                type: REPLIES_ERROR,
                err: err.message
              })
          })
};

export const reportReply = (board, thread_id, reply_id) => (dispatch, getState) => {
  
  dispatch(setRepliesLoading());

  //make async call
  return fetch('/api/replies/' + board, {
              method: 'put',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({thread_id, reply_id})

          })
            .then(handleErrors,  //http & validation errors
                  error => {throw Error(error.error)}    //any other server error
                 )
    
            .then(results => {
              return results.json();
            }).then(data => {
                    //find and mark the reply as reported
                    let thread = getState().replyList.thread;
                    let obj = thread.replies.find(reply => reply._id === reply_id);
                    let index = thread.replies.indexOf(obj);
                    thread.replies.fill(obj.reported=true, index, index++);   

                    dispatch ({
                      type: REPORT_REPLY,
                      payload: thread
                    })
              })
              .catch(err => {
                  dispatch ({
                    type: REPLIES_ERROR,
                    err: err.message
                  })
              })
};

export const deleteReply = (board, thread_id, reply_id, delete_password) => (dispatch, getState) => {

  dispatch(setModalLoading());

  //make async call
  return fetch('/api/replies/' + board, {
              method: 'delete',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({thread_id, reply_id, delete_password})

          })
            .then(handleErrors,  //http & validation errors
                  error => {throw Error(error.error)}    //any other server error
                 )
    
            .then(results => {
              return results.json();
            }).then(data => {
                    //find and mark the reply as deleted
                    let thread = getState().replyList.thread;
                    let obj = thread.replies.find(reply => reply._id === reply_id);
                    let index = thread.replies.indexOf(obj);
                    thread.replies.fill(obj.text='[deleted]', index, index++);   

                    dispatch ({
                      type: DELETE_REPLY,
                      payload: thread
                    })
              })
              .catch(err => {
                    dispatch(setModalError(err.message));
              })
};

// Handle HTTP & custom errors since fetch won't.
const handleErrors = res => {
  return handleHTTPErrors(res);
}