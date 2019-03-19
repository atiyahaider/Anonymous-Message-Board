import { combineReducers } from 'redux';
import boardReducer from './boardReducer';
import threadReducer from './threadReducer';

export default combineReducers({
    board: boardReducer,
    thread: threadReducer
});