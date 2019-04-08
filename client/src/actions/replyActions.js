import { REPLY_LOADING, ADD_REPLY, EDIT_REPLY, REPLY_ERROR } from '../actions/actionTypes';
import handleHTTPErrors from './errorHandler';

export const setReplyLoading = () => {
  return {
    type: REPLY_LOADING
  }
};

export const addReply = (reply) => dispatch => {
  dispatch(setReplyLoading());

  //make async call
  return fetch('/api/replies/' + reply.board, {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(reply)

          })
            .then(handleErrors,  //http & validation errors
                  error => {throw Error(error.error)}    //any other server error
                 )
    
            .then(results => {
              return results.json();
            }).then(data => {
                    dispatch ({
                      type: ADD_REPLY,
                      payload: data
                    })
              })
              .catch(err => {
                  dispatch ({
                    type: REPLY_ERROR,
                    err: err.message
                  })
              })
};

export const editReply = (reply) => dispatch => {
  dispatch(setReplyLoading());

  //make async call
  return fetch('/api/replies/edit/' + reply.board, {
              method: 'put',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(reply)

          })
            .then(handleErrors,  //http & validation errors
                  error => {throw Error(error.error)}    //any other server error
                 )
    
            .then(results => {
              return results.json();
            }).then(data => {
                    dispatch ({
                      type: EDIT_REPLY,
                      payload: data
                    })
              })
              .catch(err => {
                  dispatch ({
                    type: REPLY_ERROR,
                    err: err.message
                  })
              })
};

// Handle HTTP & custom errors since fetch won't.
const handleErrors = res => {
  return handleHTTPErrors(res);
}