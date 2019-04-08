import { SET_PATHNAME, SET_OFFSET, SET_TOTAL, SET_LIMIT } from '../actions/actionTypes';
import { BOARDS_LIST, THREADS_LIST, REPLIES_LIST } from './listTypes';
import { DEFAULT_LIMIT, DEFAULT_REPLIES_LIMIT } from './config.js';

const initialState = {
  boards: {
    pathname: {
      path: ''
    },
    offset: 0,
    total: 0,
    limit: DEFAULT_LIMIT
  },

  threads: {
    pathname: {
      path: '',
      params: {
        board: ''
      }
    },
    offset: 0,
    total: 0,
    limit: DEFAULT_LIMIT
  },
  
  replies: {
    pathname: {
      path: '',
      params: {
        board: '',
        threadId: ''
      }
    },
    offset: 0,
    total: 0,
    limit: DEFAULT_REPLIES_LIMIT
  }
};

export default function(state = initialState, action) {
  
  switch(action.type) {
    
    case SET_PATHNAME:
      switch(action.listType) {
        case (BOARDS_LIST): 
          return {
            ...state,
            boards: {
              ...state.boards,
              pathname: {
                path: action.pathname.path,
              },
              offset: 0,
              total: 0,
              limit: DEFAULT_LIMIT
            }
          }      
        
        case (THREADS_LIST):
          return {
            ...state,
            threads: {
              ...state.threads,
              pathname: {
                path: action.pathname.path,
                params: {
                  board: action.pathname.params.board
                }
              },
              offset: 0,
              total: 0,
              limit: DEFAULT_LIMIT
            }
          }      

        case (REPLIES_LIST):
          return {
            ...state,
            replies: {
              ...state.replies,
              pathname: {
                path: action.pathname.path,
                params: {
                  board: action.pathname.params.board,
                  threadId: action.pathname.params.threadId
                }
              },
              offset: 0,
              total: 0,
              limit: DEFAULT_REPLIES_LIMIT
            }
          }      

        default:
          return state;
      }
      
    case SET_OFFSET:
      switch(action.listType) {
        case (BOARDS_LIST): 
          return {
            ...state,
            boards: {
              ...state.boards,
              offset: action.offset
            }
          }      

        case (THREADS_LIST):
          return {
            ...state,
            threads: {
              ...state.threads,
              offset: action.offset
            }
          }      
        
        case (REPLIES_LIST):
          return {
            ...state,
            replies: {
              ...state.replies,
              offset: action.offset
            }
          }      

        default: 
          return state;
      }
      
    case SET_TOTAL:
      switch(action.listType) {
        case (BOARDS_LIST): 
          return {
            ...state,
            boards: {
              ...state.boards,
              total: action.total
            }
          } 
          
        case (THREADS_LIST):
          return {
            ...state,
            threads: {
              ...state.threads,
              total: action.total
            }
          }
          
        case (REPLIES_LIST):
          return {
            ...state,
            replies: {
              ...state.replies,
              total: action.total
            }
          }

        default: 
          return state;
      }
        
    case SET_LIMIT:
      switch(action.listType) {
        case (BOARDS_LIST): 
          return {
            ...state,
            boards: {
              ...state.boards,
              offset: action.offset,
              limit: action.limit
            }
          }

        case (THREADS_LIST):
          return {
            ...state,
            threads: {
              ...state.threads,
              offset: action.offset,
              limit: action.limit
            }      
          }

        case (REPLIES_LIST):
          return {
            ...state,
            replies: {
              ...state.replies,
              offset: action.offset,
              limit: action.limit
            }      
          }
          
        default: 
          return state;
      }

    default:
      return state;
  }
}



