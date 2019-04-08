import { REPLIES_LOADING, GET_THREAD, GET_REPLIES, REPLIES_ERROR, REPORT_REPLY, DELETE_REPLY } from '../actions/actionTypes';

const initialState = {
  thread: null,
  replies: [],
  loading: false,
  err: null
}

export default function(state = initialState, action) {

  switch(action.type) {
  
    case REPLIES_LOADING:
      return {
        ...state,
        loading: true,
        err: null
      }
    
    case GET_THREAD:
      return {
        ...state,
        thread: action.payload,
        loading: false,
        err: null
      }
      
    case GET_REPLIES:
      return {
        ...state,
        replies: action.replies,
        loading: false,
        err: null
      }

    case REPLIES_ERROR:
      return {
        ...state,
        loading: false,
        err: action.err
      }

    case REPORT_REPLY:
    case DELETE_REPLY:
      return {
        ...state,
        thread: action.payload,
        loading: false,
        err: null
      }

    default:
      return state;
  }
}