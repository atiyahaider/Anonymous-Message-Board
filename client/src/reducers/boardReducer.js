import { ERROR, GET_BOARDS, ADD_BOARD, BOARDS_LOADING } from '../actions/actionTypes';

const initialState = {
  boards: [],
  loading: false,
  err: ''
}

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_BOARDS:
      return {
        ...state,
        boards: action.payload,
        loading: false
      }
    case ADD_BOARD:
      return {
        ...state
      }
    case BOARDS_LOADING:
      return {
        ...state,
        loading: true
      }
    case ERROR:
      return {
        ...state,
        err: action.err
      }
    default:
      return state;
  }
}