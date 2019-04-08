import { combineReducers } from 'redux';
import modalReducer from './modalReducer';
import paginationReducer from './paginationReducer';
import boardListReducer from './boardListReducer';
import threadReducer from './threadReducer';
import threadListReducer from './threadListReducer';
import replyListReducer from './replyListReducer';
import replyReducer from './replyReducer';

export default combineReducers({
    modal: modalReducer,
    pagination: paginationReducer,
    boardList: boardListReducer,
    thread: threadReducer,
    threadList: threadListReducer,
    replyList: replyListReducer,
    reply: replyReducer
});