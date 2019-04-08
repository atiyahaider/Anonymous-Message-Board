import { REPLY_LOADING, ADD_REPLY, EDIT_REPLY, REPLY_ERROR } from '../actions/actionTypes';

const initialState = {
  loading: false,
  data: null,
  err: null
}

export default function(state = initialState, action) {
  
  switch(action.type) {
    
    case REPLY_LOADING:
      return {
        ...state,
        loading: true,
        err: null
      }
      
    case ADD_REPLY:
    case EDIT_REPLY:
      return {
        ...state,
        loading: false,
        data: action.payload,
        err: null
        }
    
    case REPLY_ERROR:
      return {
        ...state,
        loading: false,
        err: action.err
      }     
    
    default:
      return state;
  }
}