import { ERROR, GET_BOARDS, ADD_BOARD, BOARDS_LOADING } from './actionTypes';

export const getBoards = () => dispatch => {
  dispatch(setBoardsLoading());
  
  //make async call
  fetch('/api/boards')
    .then(results => {
      return results.json();
    }).then(data => {
            dispatch ({
              type: GET_BOARDS,
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

export const addBoard = () => {
  return {
    type: ADD_BOARD
  }
};

export const setBoardsLoading = () => {
  return {
    type: BOARDS_LOADING
  }
};