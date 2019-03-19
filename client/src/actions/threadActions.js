import { ADD_THREAD, ERROR } from './actionTypes';

export const addThread = (thread) => dispatch => {
  console.log(thread);
  //make async call
  fetch('/api/threads/' + thread.board, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(thread)
  }).then(results => {
      return results.json();
    }).then(data => {
            dispatch ({
              type: ADD_THREAD,
              payload: data
            })
      })
      .catch(err => {
          dispatch ({
            type: ERROR,
            err: err
          })
      })
};