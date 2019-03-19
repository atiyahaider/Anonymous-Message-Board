import { ADD_THREAD, ERROR } from '../actions/actionTypes';

const initialState = {
  boards: '',
  title: '',
  text: '',
  delete_password: '',
  err: ''
}

export default function(state = initialState, action) {
  switch(action.type) {
    case ADD_THREAD:
      return {
        ...state,
        data: action.payload
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