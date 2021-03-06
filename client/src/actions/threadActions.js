import { THREAD_LOADING, ADD_THREAD, EDIT_THREAD, THREAD_ERROR } from './actionTypes';
import handleHTTPErrors from './errorHandler';

export const setThreadLoading = () => {
  return {
    type: THREAD_LOADING
  }
};

export const addThread = (thread) => dispatch => {
  dispatch(setThreadLoading());
  
  //make async call
  return fetch('/api/threads/' + thread.board, {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(thread)

          })
            .then(handleErrors,  //http & validation errors
                  error => {throw Error(error.error)}    //any other server error
                 )
    
            .then(results => {
              return results.json();
            }).then(data => {
                    dispatch ({
                      type: ADD_THREAD,
                      payload: data
                    })
              })
              .catch(err => {
                  dispatch ({
                    type: THREAD_ERROR,
                    err: err.message
                  })
              })
};

export const editThread = (thread) => dispatch => {
  dispatch(setThreadLoading());

  //make async call
  return fetch('/api/threads/edit/' + thread.board, {
              method: 'put',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(thread)

          })
            .then(handleErrors,  //http & validation errors
                  error => {throw Error(error.error)}    //any other server error
                 )
    
            .then(results => {
              return results.json();
            }).then(data => {
                    dispatch ({
                      type: EDIT_THREAD,
                      payload: data
                    })
              })
              .catch(err => {
                  dispatch ({
                    type: THREAD_ERROR,
                    err: err.message
                  })
              })
};

// Handle HTTP & custom errors since fetch won't.
const handleErrors = res => {
  return handleHTTPErrors(res);
}