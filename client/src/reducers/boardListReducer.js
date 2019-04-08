import { BOARDS_LOADING, GET_BOARDS, BOARDS_ERROR } from '../actions/actionTypes';

const initialState = {
  boards: [],
  loading: false,
  err: null
}

export default function(state = initialState, action) {

  switch(action.type) {
  
    case BOARDS_LOADING:
      return {
        ...state,
        loading: true,
        err: null
      }
    
    case GET_BOARDS:
      return {
        ...state,
        boards: action.payload,
        loading: false,
        err: null
      }
      
    case BOARDS_ERROR:
      return {
        ...state,
        loading: false,
        err: action.err
      }

    default:
      return state;
  }
}