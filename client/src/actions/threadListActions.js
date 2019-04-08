import { THREADS_LOADING, GET_THREADS, THREADS_ERROR, REPORT_THREAD, DELETE_THREAD } from './actionTypes';
import handleHTTPErrors from './errorHandler';

import { setPathname, setTotal, setLimit } from './paginationActions';
import { THREADS_LIST } from '../reducers/listTypes';

import { setModalError, setModalLoading } from './modalActions';

export const setThreadsLoading = () => {
  return {
    type: THREADS_LOADING
  }
};

export const getThreadList = (pathname) => (dispatch, getState) => {
  dispatch(setThreadsLoading());

  let pagination = getState().pagination.threads;
  if ((pagination.pathname.path !== pathname.path) || (pagination.pathname.params.board !== pathname.params.board)) {
    dispatch(setPathname(THREADS_LIST, pathname.path, pathname.params.board));
    pagination = getState().pagination.threads;
  }

  //make async call
  return fetch('/api/threads/' + pagination.pathname.params.board + '?offset=' + pagination.offset + '&limit=' + pagination.limit)
        .then(handleErrors,     //http & validation errors
              error => {throw Error(error.error)}    //any other server error
             )

        .then(results => {
          return results.json();
        }).then(data => {
                dispatch(setTotal(THREADS_LIST, data.total));
                dispatch ({
                  type: GET_THREADS,
                  payload: data.data
                })
          })
          .catch(err => {
              dispatch ({
                type: THREADS_ERROR,
                err: err.message
              })
          })
};

export const reportThread = (board, thread_id) => (dispatch, getState) => {
  
  dispatch(setThreadsLoading());

  //make async call
  return fetch('/api/threads/' + board, {
              method: 'put',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({thread_id})

          })
            .then(handleErrors,  //http & validation errors
                  error => {throw Error(error.error)}    //any other server error
                 )
    
            .then(results => {
              return results.json();
            }).then(data => {
                    //find and mark the thread as reported
                    let threads = getState().threadList.threads;
                    let obj = threads.find(thread => thread._id === thread_id);
                    let index = threads.indexOf(obj);
                    threads.fill(obj.reported=true, index, index++);   

                    dispatch ({
                      type: REPORT_THREAD,
                      payload: threads
                    })
              })
              .catch(err => {
                  dispatch ({
                    type: THREADS_ERROR,
                    err: err.message
                  })
              })
};

export const deleteThread = (board, thread_id, delete_password) => (dispatch, getState) => {

  dispatch(setModalLoading());

  //make async call
  return fetch('/api/threads/' + board, {
              method: 'delete',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({thread_id, delete_password})

          })
            .then(handleErrors,  //http & validation errors
                  error => {throw Error(error.error)}    //any other server error
                 )
    
            .then(results => {
              return results.json();
            }).then(data => {
                    dispatch ({
                      type: DELETE_THREAD
                    })
                    let pagination = getState().pagination.threads
                    dispatch(setLimit(THREADS_LIST, pagination.limit, pagination.pathname));
              })
              .catch(err => {
                    dispatch(setModalError(err.message));
              })
};

// Handle HTTP & custom errors since fetch won't.
const handleErrors = res => {
  return handleHTTPErrors(res);
}