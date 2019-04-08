import { BOARDS_LOADING, GET_BOARDS, BOARDS_ERROR } from './actionTypes';
import handleHTTPErrors from './errorHandler';
import { setPathname, setTotal } from './paginationActions';
import { BOARDS_LIST } from '../reducers/listTypes';

export const setBoardsLoading = () => {
  return {
    type: BOARDS_LOADING
  }
};

export const getBoards = (pathname) => (dispatch, getState) => {
  
  dispatch(setBoardsLoading());

  let pagination = getState().pagination.boards;
  if (pagination.pathname.path !== pathname.path) {
    dispatch(setPathname(BOARDS_LIST, pathname.path));
    pagination = getState().pagination.boards;
  }

  //make async call
  return fetch('/api/boards?offset=' + pagination.offset + '&limit=' + pagination.limit)
        .then(handleErrors,                          //http & validation errors
              error => {throw Error(error.error)}    //any other server error
             )

        .then(results => {
          return results.json();
        }).then(data => {
                dispatch(setTotal(BOARDS_LIST, data.total));
                dispatch ({
                  type: GET_BOARDS,
                  payload: data.data
                })
          })
          .catch(err => {
              dispatch ({
                type: BOARDS_ERROR,
                err: err.message
              })
          })
};

// Handle HTTP & custom errors since fetch won't.
const handleErrors = res => {
  return handleHTTPErrors(res);
};