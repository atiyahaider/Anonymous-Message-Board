import { THREADS_LOADING, GET_THREADS, THREADS_ERROR, REPORT_THREAD, DELETE_THREAD } from '../actions/actionTypes';

const initialState = {
  threads: [],
  loading: false,
  err: null
}

export default function(state = initialState, action) {

  switch(action.type) {
  
    case THREADS_LOADING:
      return {
        ...state,
        loading: true,
        err: null
      }
    
    case GET_THREADS:
      return {
        ...state,
        threads: action.payload,
        loading: false,
        err: null
      }
      
    case THREADS_ERROR:
      return {
        ...state,
        loading: false,
        err: action.err
      }

    case REPORT_THREAD:
      return {
        ...state,
        threads: action.payload,
        loading: false,
        err: null
      }

    case DELETE_THREAD:
      return {
        ...state,
        loading: false,
        err: null
      }
      
    default:
      return state;
  }
}