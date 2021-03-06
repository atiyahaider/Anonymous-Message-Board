import { THREAD_LOADING, ADD_THREAD, EDIT_THREAD, THREAD_ERROR } from '../actions/actionTypes';

const initialState = {
  loading: false,
  data: null,
  err: null
}

export default function(state = initialState, action) {
  
  switch(action.type) {
    
    case THREAD_LOADING:
      return {
        ...state,
        loading: true,
        err: null
      }
      
    case ADD_THREAD:
    case EDIT_THREAD:
      return {
        ...state,
        loading: false,
        data: action.payload,
        err: null
        }

    case THREAD_ERROR:
      return {
        ...state,
        loading: false,
        err: action.err
      }     
    
    default:
      return state;
  }
}